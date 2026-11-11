"""Run Plone's core upgrade steps on every Plone site in the database.

Run it inside the backend container (the entrypoint's `run` command calls
`zconsole run`), with the backend itself stopped:

    docker compose run --rm --no-deps \
        -v "$PWD/upgrade_site.py:/scripts/upgrade_site.py:ro" \
        backend run /scripts/upgrade_site.py </dev/null

Prints the version before and after, and lists installed add-on profiles that
still have upgrade steps (run those from the Add-ons control panel, or extend
this script). Commits only if the core upgrade succeeds.
"""

from AccessControl.SecurityManagement import newSecurityManager
from AccessControl.users import system
from Products.CMFPlone.Portal import PloneSite
from Testing.makerequest import makerequest
from zope.component.hooks import setSite

import transaction


app = makerequest(app)  # noqa: F821 (provided by zconsole run)
newSecurityManager(None, system)

for site_id, site in app.objectItems():
    if not isinstance(site, PloneSite):
        continue
    setSite(site)
    migration = site.portal_migration
    print(
        f"== {site_id}: instance {migration.getInstanceVersion()}"
        f" -> code {migration.getFileSystemVersion()}"
    )
    if migration.needUpgrading():
        migration.upgrade(dry_run=False)
    print(
        f"   now: {migration.getInstanceVersion()}"
        f"  needUpgrading={migration.needUpgrading()}"
    )
    setup = site.portal_setup
    pending = [
        (profile_id, len(setup.listUpgrades(profile_id)))
        for profile_id in setup.listProfilesWithUpgrades()
        # "unknown" means the profile was never installed on this site.
        if setup.getLastVersionForProfile(profile_id) != "unknown"
        and setup.listUpgrades(profile_id)
    ]
    print("   installed add-on profiles with pending upgrades:", pending or "none")
    transaction.commit()
