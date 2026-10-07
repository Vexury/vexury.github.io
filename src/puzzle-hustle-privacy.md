---
layout: base.html
title: Puzzle Hustle Privacy Policy
---

# Puzzle Hustle Privacy Policy

<p class="post-date">Last updated: October 7, 2026</p>

This policy covers the Puzzle Hustle app for Android and iOS, and the web version at
[puzzles.vexury.dev](https://puzzles.vexury.dev/). For the rest of this website, see the
[Datenschutzerklärung](/datenschutz/).

## The short version

You can play every puzzle without an account, and there is no crash reporting and no third-party
analytics. Settings and unfinished boards stay on your device; if you sign in, your progress, coins and equipped items are also kept on our server so they are the same on all your devices. The app does send
pseudonymous usage statistics (how long puzzles take, where players stop, how often ads are watched) that carry no account,
device or advertising ID and no IP address; we do not link them to you, and you can switch them off
under Profile, Account.

Signing in is optional. It unlocks private groups where friends compare their Daily, Weekly and
Monthly times, and it keeps your progress in sync across your devices. If you sign in, our server keeps an account ID from Google
or Apple, your display name, the badges, flair and nameplate you show, your Hustle level, your groups, the times you submit and a copy of your progress.
It never stores your email address. You can delete the account in the app at any time.

The Android and iOS apps show rewarded video ads, which you only ever see after choosing to watch
one, either for a hint or to double the coins of a Daily, Weekly or Monthly you just solved. In
Hustle, from stage 20, they also show an occasional full-screen ad between stages. Those ads come
from Google. The web version has no ads.

## Who is responsible

Moritz Grauer (Vexury)
Klara-Siebert-Straße 17
76137 Karlsruhe, Germany
vexury.dev@gmail.com

## What the app stores, and where

The app saves the following on your device:

- which puzzles you have solved, with time, moves and hints used
- your streak, the days you have played and your achievements
- your coins and the badges, flairs, nameplates and theme packs you own, and what you put on show
- the day you last used your free hint
- unfinished puzzles, so you can pick them up where you left off
- settings such as the theme, your display name and your last chosen difficulty
- if you are signed in, your session and any times still waiting to be sent; after signing out,
  the last account's player ID and provider (Google or Apple), so the app can offer it first
- the day you first played, and any usage statistics still waiting to be sent (see below)
- whether the daily reminder is on and at what hour, how often the app has offered it, and on
  which streak days the app has asked the store for a rating

On Android and iOS this lives in the app's local storage and in a backup copy in the app's own
private preferences, so that clearing the app cache does not wipe your progress. If you have
device backups switched on, Android or iOS may include this data in your Google or iCloud backup;
that is between you and Google or Apple. We cannot see any of it, and we cannot restore it for
you. Uninstalling the app deletes it from the device.

The Account page under Profile has a reset button. Signed out, it erases your progress on the device on the spot. Signed in, it erases it on all your devices and in the copy on our server. It does not touch your account or the times you have already submitted; deleting the account does that.

## Signing in

Signing in is optional. Without it every puzzle, level, hint and achievement works exactly the
same. Only the Social page under Profile and the progress sync need an account.

- On Android and on the web you sign in with **Google**. On the web, Google's sign-in script is
  only loaded once you tap Sign in.
- On iOS you sign in with **Apple**. The app asks Apple for neither your name nor your email
  address.

Google or Apple hands the app a signed token, which our server checks. From it the server keeps
only the account identifier the provider issues for this app (the provider's "subject" ID) and
which provider it came from. A Google token can also carry your email address and name; the server
reads neither and stores neither. The provider learns that you signed in to Puzzle Hustle, under
its own privacy policy ([Google](https://policies.google.com/privacy),
[Apple](https://www.apple.com/legal/privacy/)).

Your session stays valid for 30 days and renews itself while you play. Signing out ends it on the
device.

## What our server keeps

Apart from the usage statistics below, the server exists only for groups, standings and
progress sync. Solving never waits for it, and no puzzle comes from it. If you are signed in, it
stores:

- **Account:** a random player ID, the provider (Google or Apple) with its subject ID, and when
  the account was created.
- **Display name:** the name you choose, or a generated one such as "Player 4821" until you do.
  Names are 2 to 14 characters, may not contain links, and a short list of offensive words is
  refused.
- **Badge, flair and nameplate:** the one badge, one flair and one nameplate you have equipped, as
  IDs from the app's fixed list.
- **Hustle level:** the stage you have reached in Hustle mode, as a single number.
- **Progress copy:** so your progress is the same on every device you sign in on, a copy of the puzzles you have solved (with time, hints, moves and when), your coin spending, the puzzles whose coins you doubled and the items you have equipped. Unfinished puzzles and settings are not part of it. It is used for nothing but syncing, is shown to nobody, and is deleted with your account.
- **Groups:** the groups you created or joined, their names and invite codes (six or eight characters), and
  when you joined, and, if a group's creator removed you, that you may not rejoin that group. A
  player can be in at most 5 groups, and a group holds at most 50 players.
- **Times:** for each Daily, Weekly and Monthly puzzle you solve while signed in, your time, hints,
  moves and when you solved it. Times you solved shortly before signing in are sent once you do.
  Level and random puzzles are never sent.
- **Reports:** when you report a name, who reported whom, the reason and when.
- **Join attempts:** how many unknown invite codes you entered on the current day (UTC), so that
  guessing codes is blocked after 30. Overwritten each day.

Other members of a group you are in see your display name, nameplate, badges, flair, Hustle level, and your time and hints
for each Daily, Weekly and Monthly. Nobody outside your groups sees your name. The standings also
show how you did against everyone who solved the same puzzle, as an anonymous count.

When you share a result, the app makes the picture on your device; nothing is uploaded. The
picture shows your display name, Hustle level, badges, flair and nameplate, and may show the name
of your best group, to whoever you send it to.

The data stays on the server for as long as your account exists. There is no automatic expiry.

### Reports and moderation

Every name in the standings has a report button. There is no automatic ban. We read reports by
hand, and a name that breaks the rules above may be replaced with a generated one, or an account
used for abuse deleted. A group's creator can remove members from it, and anyone can leave a group
at any time.

### Cloudflare

The server is a Cloudflare Worker with a Cloudflare D1 database, run by Cloudflare, Inc., 101
Townsend St, San Francisco, CA 94107, USA, which processes the data on our behalf under its data
processing addendum. To answer requests and protect the service, Cloudflare processes technical
data such as your IP address; the sign-in and statistics endpoints use it to limit how often one
address can send requests. We do not store IP addresses. Cloudflare may process data outside the European Union; it is
certified under the EU-U.S. Data Privacy Framework, and its data processing addendum includes the
EU Standard Contractual Clauses. See the
[Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/).

### Deleting your account

In the app, open Profile, then Account, tap **Delete account** and confirm. On iOS, Apple's sign-in sheet opens
once more so that the app can also revoke Puzzle Hustle's access to your Apple ID; if you close the
sheet, nothing is deleted. Without installing anything, you can delete a Google or Apple account
at [puzzles.vexury.dev/delete-account](https://puzzles.vexury.dev/delete-account) after signing in.

Deleting removes your account, display name, badges, flair, nameplate, Hustle level, the progress copy, all your submitted times, every report
you made or that was made about you, the count of unknown invite codes, and your group memberships, right away. A group you created
passes to its longest-standing member, or is deleted if you were the last one in it. Your progress
on the device is not affected. The automatic recovery points of our database on Cloudflare still
hold the deleted data for up to 30 days, then it is gone for good; we do not restore from them to
undo a deletion.

If you cannot use the app, write to vexury.dev@gmail.com with your display name and the name of a
group you are in, and we will delete the account for you.

## Usage statistics

To find out which puzzles are too hard, too easy or confusing, and how often ads are offered,
watched or missing (so we can set how often they appear and what a video is worth), the app sends
short records to our server. There is one when you open the app on a day, one when you finish or skip
the introduction, one each time you leave or solve a puzzle, and one each time an ad is offered or
due and what came of it. A record contains:

- the calendar day (no time of day)
- the platform (Android, iOS or web) and which build of the app
- how long ago you started playing, in coarse steps (first day, second day, third day, 3 to 6
  days, 1 to 2 weeks, 2 to 4 weeks, 1 to 3 months, longer)
- for a puzzle: its type, difficulty, whether it was a Daily, Weekly, Monthly, level, Hustle or
  random puzzle and the level number or Hustle stage, whether you solved or left it, the time, moves and hints, whether
  you had played it before and whether it was your first puzzle of that type
- for the introduction: which card you reached and whether you finished or skipped it
- for an ad: where it was (hint, double coins, or a break between Hustle stages) and
  what came of it (offered, coins chosen instead, watched, closed early, no ad available, shown)

A record contains no account ID, no device or advertising ID, no name and no IP address, and
records carry nothing that ties one to another. They are pseudonymous, not fully anonymous: for
signed-in players, what a record says about a puzzle could in principle be matched to the progress
copy on our server. We do not do that and never send a record together with your account. Records wait on your device until they can be sent, and they are sent whether or not you are
signed in. Our server keeps them for about 13 months and
then deletes them. We look at them only as totals, such as the median time of a Daily.

You can switch this off at any time under **Anonymous stats** in Profile, Account. Switching it
off also deletes any records not yet sent.

The legal basis is our legitimate interest in improving the puzzles and in setting ad frequency and rewards fairly (Art. 6(1)(f) GDPR). As
nothing sent carries your identity and we only look at totals, the impact on you is minimal, and you can object at any time by
switching the statistics off.

## Ads

You get one free hint a day, across all puzzles. Beyond that a hint costs 20 coins or, in the
Android and iOS apps, a short video, and the app asks first: the video only starts if you tap "Watch video". Declining costs you
nothing, and if no ad can be delivered you get the hint anyway.

After you solve a Daily, Weekly or Monthly, the result card in the Android and iOS apps can also
offer "Watch video · double": the video only starts if you tap it, and when it has played the coins
for that puzzle count twice. Declining costs you nothing. If no ad can be delivered, the coins are
not doubled and you can try again later while that puzzle's day, week or month is running.

In Hustle, from stage 20, the Android and iOS apps show an occasional full-screen ad when you move on
to the next stage: at most one after 5 stages and 4 minutes of play, or after 10 minutes of play,
since the last ad, and never when you leave a stage that ends a round of ten. A video you chose to
watch counts as the last ad. Daily, Weekly, Monthly, levels and random puzzles never show these ads,
and with "No Ads · Free Hints" you never see them. The app loads such an ad in advance; if none is
ready, you go on at once. To space them, the app keeps on your device how many stages and minutes
you have played since the last ad.

The ads are served by Google AdMob (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
Ireland). To show and measure them, Google processes your device's **advertising ID** along with
technical data such as your device type, operating system version, coarse location derived from
your IP address, and how you interacted with the ad. We never receive any of that from Google, and
we cannot link it to you or to your Puzzle Hustle account. Our own usage statistics (above) only
note whether an ad was offered, watched, closed early or unavailable, without any ID.

On iOS the app never shows Apple's tracking prompt, so Google's SDK does not get your iPhone's
advertising identifier (IDFA).

We do not use Google Analytics for Firebase, and AdMob's user metrics are switched off for this
app. Ads are limited to the "General" content rating, so nothing stronger than the app itself
should appear.

### Your choice, and how to change it

In the European Economic Area, the United Kingdom and Switzerland the app asks for your consent
before the first ad, using Google's User Messaging Platform. You can refuse, and refusing is
offered as plainly as agreeing. Refusing does not lock you out of anything: hints still work.

You can change your mind at any time through **Ad privacy settings** at the bottom of the Profile
screen, which reopens the same dialog.

Independently of that, Android lets you reset or delete your advertising ID under
Settings → Google → Ads.

The legal basis for personalised advertising is your consent, Art. 6(1)(a) GDPR, which you may
withdraw at any time with effect for the future. How Google handles the data is described in the
[Google Privacy Policy](https://policies.google.com/privacy) and in
[How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).

## No Ads · Free Hints

The app offers one purchase, "No Ads · Free Hints", which makes every hint free and doubles the
coins of every new Daily, Weekly and Monthly you solve, so no video is ever needed. On Android it
is handled entirely by Google Play, on iOS entirely by Apple's App Store. Your payment details go
to Google or Apple, never to us, and we never see your name, address or card.

At each start the app asks Google Play or the App Store whether this purchase exists for your
store account, and stores only that yes or no on your device. Our server records no purchases, but the progress copy lists which solves were
doubled, whether by a video or by the purchase. Refunds and payment questions go through Google Play or Apple.

Coins are earned by solving and cannot be bought directly; the purchase only doubles what new
Daily, Weekly and Monthly solves earn. Which solves were doubled is stored on your device, and for signed-in players in the progress copy.

## Network

The app generates every puzzle on your device from the current date, which is why everyone gets
the same daily puzzles without anything being transmitted. Puzzles, progress and settings work with
no connection at all.

It reaches the internet for these things, and only these:

- talking to our server: while you are signed in for standings, groups, your name, what you show,
  your submitted times and your synced progress, and, unless you switch it off, for the usage statistics
- signing in with Google or Apple, when you choose to
- loading and showing ads
- asking Google Play or the App Store about the "No Ads · Free Hints" purchase
- on streak days 4, 12 and 31, asking Google Play or the App Store to show their own rating
  dialog; the store decides whether it appears, and any rating you give goes to the store, not to us

The web version has to be delivered to your browser, and that is done by GitHub Pages. Like any
web host, GitHub processes access data such as your IP address, the page requested and the time of
the request in order to serve the page and keep the service secure. We do not receive that data
and have no access to it. GitHub's own privacy statement covers it:
[docs.github.com/site-policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement).

## Sharing a result

When you share a result or a group invite, the app hands a short text and a link to your device's
share sheet. You choose which app receives it. We are not part of that and never see what you send
or who you send it to.

## Daily reminder

If you turn it on, the app schedules one notification a day on your device, at the hour you pick,
and leaves out days on which your streak is already safe. Scheduling happens entirely on the device
and sends nothing to us or anyone else. It is off until you switch it on, and you can switch it off
under Profile → Gameplay or in your device's notification settings.

## Permissions

The Android build declares internet and network state access, the advertising ID permission that
the Google Mobile Ads SDK requires, the billing permission for the purchase, and, for the daily
reminder, permission to post notifications and to keep scheduled reminders across a restart
(receive boot completed, wake lock). The only runtime permission either app asks for is permission
to show notifications, and only when you turn on the daily reminder. No camera, no microphone, no
contacts, no location, no photos, no tracking.

## Children

Puzzle Hustle is not directed at children under 13. We do not knowingly collect data from children,
and ads are limited to the "General" content rating.

## Your rights

Under the GDPR you have the right to access, correct, delete and port your data, to restrict or
object to its processing, and to complain to a supervisory authority.

If you never sign in, we hold nothing that identifies you: everything the app saves sits on your device,
where the reset button under Profile, Account and uninstalling both clear it.

If you do sign in, the data listed under "What our server keeps" is processed to provide the
groups, standings and progress sync you asked for (Art. 6(1)(b) GDPR). Handling reports and limiting sign-in
attempts serve our legitimate interest in a fair service that is safe from abuse (Art. 6(1)(f)
GDPR). The usage statistics are described in their own section above. You can change your name in the Profile screen, leave any group and delete the account
yourself as described above. For a copy of your data, or anything the app does not let you do
yourself, write to us.

What Google processes for advertising is in your hands too: withdraw consent through Ad privacy
settings in the app, or reset or delete the advertising ID in your Android settings. For requests
about data Google or Apple holds, they are the contact, through the links above.

Questions go to vexury.dev@gmail.com and get an answer.

## Changes

This policy will be updated when the app changes in a way that affects it.

- October 6, 2026: one badge on show instead of up to three; the lists stored before are deleted.
- October 5, 2026: occasional full-screen ads between Hustle stages from stage 20, never with the
  "No Ads · Free Hints" purchase. The usage statistics also record when an ad is offered or due and
  what came of it. Account deletion now says that database recovery points keep deleted data for up
  to 30 days.
- October 3, 2026: the usage statistics are now described as pseudonymous, since for signed-in players they could be matched to the progress copy. Progress sync. If you sign in, your solved puzzles, coin spending and equipped items are also kept on our server, so your progress is the same on all your devices, and are deleted with the account. The reset button then erases your progress on all your devices.
- October 2, 2026: up to three badges on show and a nameplate, shown to members of your groups;
  the hint rules (one free hint a day) and the purchase's new name "No Ads · Free Hints". Names are now at most 14 characters. Also listed now: what the app keeps on the device after you sign
  out, and the note the server keeps when a group's creator removes you.
- September 30, 2026: the Hustle level, shown to members of your groups.
- September 30, 2026: usage statistics tell Hustle puzzles and their stage apart from random ones.
- September 28, 2026: anonymous usage statistics, with a switch in the Profile screen.
- September 25, 2026: optional sign-in with Google and Apple, private groups and standings, our
  server on Cloudflare, reports, account deletion, the iOS app and purchases through the App
  Store.
- September 21, 2026: rewarded ads and the "Unlimited Hints" purchase.
