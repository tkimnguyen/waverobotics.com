from plone import api
from plone.restapi.testing import RelativeSession

import pytest
import transaction


ENDPOINT = "/@sponsors"

# (level id, number of published sponsors); "empty" has none and is omitted
# from the response.
LEVELS = [("platinum", 1), ("bronze", 2), ("empty", 0), ("organizer", 3)]


@pytest.fixture
def portal(functional):
    portal = functional["portal"]
    with api.env.adopt_roles(["Manager"]):
        portal.portal_workflow.setChainForPortalTypes(
            ("SponsorsDB", "SponsorLevel", "Sponsor"), "simple_publication_workflow"
        )
        db = api.content.create(container=portal, type="SponsorsDB", id="sponsors")
        api.content.transition(db, "publish")
        for level_id, total in LEVELS:
            level = api.content.create(container=db, type="SponsorLevel", id=level_id)
            api.content.transition(level, "publish")
            for idx in range(total):
                sponsor = api.content.create(
                    container=level, type="Sponsor", id=f"{level_id}-{idx}"
                )
                api.content.transition(sponsor, "publish")
            # An unpublished sponsor is never listed.
            api.content.create(container=level, type="Sponsor", id=f"{level_id}-draft")
    transaction.commit()
    return portal


@pytest.fixture
def api_session(portal):
    base_url = portal.absolute_url()
    session = RelativeSession(base_url)
    session.headers.update({"Accept": "application/json"})
    return session


class TestSponsorsService:
    def test_get_sponsors_as_anonymous(self, api_session):
        response = api_session.get(ENDPOINT)
        assert response.status_code == 200

    def test_get_sponsors_levels(self, api_session):
        response = api_session.get(ENDPOINT)
        payload = response.json()
        assert [level["id"] for level in payload["levels"]] == [
            "platinum",
            "bronze",
            "organizer",
        ]

    @pytest.mark.parametrize(
        "name,idx,total",
        [
            ["platinum", 0, 1],
            ["bronze", 1, 2],
            ["organizer", 2, 3],
        ],
    )
    def test_get_sponsors_values(self, api_session, name, idx, total):
        response = api_session.get(ENDPOINT)
        payload = response.json()
        level = payload["levels"][idx]
        assert level["id"] == name
        assert len(level["items"]) == total
