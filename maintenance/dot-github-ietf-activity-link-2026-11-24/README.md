# 24 November 2026: link the SCITT mailing-list record from the GitHub profile

**Status: prepared; not applied.** The `veritaschain/.github` repository could
not be edited from the session that prepared this package (repositories whose
names begin with "." cannot be attached, and the browser was not available).
Nothing in `.github` was changed.

## What the patch changes

`profile/README.md`, section "Internet-Drafts (IETF)": adds four lines after the
standing statement, linking https://veritaschain.org/standardization/ietf-activity/
and saying that mailing-list participation is individual participation, not
Working Group adoption. No other line changes.

## Apply

Apply after vcp-site #279 is merged, so that the link resolves.

```
cd .github
git switch -c docs/link-scitt-list-activity-20261124
git apply --check /path/to/profile-README.patch && git apply /path/to/profile-README.patch
```

Then open a pull request (as for `.github` #16 and #17); merge on owner
instruction.

| File | SHA-256 |
| --- | --- |
| `profile/README.md` before (main, fetched 24 November 2026) | `6ac4cba16c0932e4fcd3e76b30b0563a3c41256576d4df3c07a617fb70ba9883` |
| `profile/README.md` after | `cf4631c07227bbbe2dd6a4c36fca58316a3bd039439fcbf2749392c907c08973` |

If `main` has changed since, `git apply --check` fails; re-create the patch
against the current file instead of forcing it.
