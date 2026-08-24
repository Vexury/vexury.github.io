---
title: "🎬 A Show Tracker Built From One JSON File"
date: 2026-08-24
summary: "A static horror, mystery and thriller tracker for the site: one JSON file, no backend, no client-side state, and a couple of things TMDB taught me the hard way."
preview_image: /images/ShowTracker_Preview.jpg
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="/show-tracker/" class="link-btn">Open the Show Tracker</a>
</div>

I wanted a place to keep track of the horror, mystery and thriller films and series I have watched, with a rating attached to each one. Not a Letterboxd account, just a page on this site that I own and that loads instantly. The whole thing is static: the site already builds with Eleventy and deploys through GitHub Actions, so the cheapest possible design was to make the data a file in the repo and let the existing pipeline do the rest.

The result lives at [/show-tracker/](/show-tracker/). It has three sections: a hall of fame, a watchlist, and the full collection of everything watched.

## One file, no backend

Every entry is an object in `src/_data/showtracker.json`, and that file is the only source of truth:

```json
{
  "id": "the-haunting-of-hill-house",
  "title": "The Haunting of Hill House",
  "type": "show",
  "releaseMonth": 10,
  "releaseYear": 2018,
  "image": "https://image.tmdb.org/t/p/w342/nWPZb800NCGiDPNGsKCfY0w44Z2.jpg",
  "distributor": "Netflix",
  "production": ["Intrepid Pictures"],
  "seasons": 1,
  "episodes": 10,
  "avgEpisodeMinutes": 60,
  "rating": 9,
  "status": "watched"
}
```

A `status` of `watchlist`, `watched` or `hall_of_fame` decides which sections an entry appears in, and the three groups are filtered out of that one array at build time. There is no client-side state anywhere: no localStorage, no forms, no fetch. Rating something means editing its `rating` field and pushing the commit, which is a workflow I actually prefer, because it means the data is versioned and I can never lose it to a service shutting down.

## Sorting is where Liquid gives up

Grouping is easy enough with Liquid's `where` and `where_exp`. Ordering was not. Liquid's `sort` filter takes a single property and has no descending form, and more annoyingly it treats `null` as sorting before everything else. My unrated watchlist entries floated straight to the top, above the 10s.

So the ordering moved into two small filters in `.eleventy.js`:

```js
eleventyConfig.addFilter("sortByRatingDesc", function (arr) {
  return [...(arr || [])].sort((a, b) =>
    (b.rating ?? -1) - (a.rating ?? -1) || a.title.localeCompare(b.title));
});
```

Two keys, descending, with unrated entries pushed to the bottom instead of the top, and ties broken alphabetically so the order is stable between builds. It runs once at build time, which is the right place for it.

## Posters, and two ways to get them wrong

Posters are hotlinked from TMDB's image CDN rather than committed to the repo. That keeps a hundred-odd JPEGs out of git, at the cost of skipping the site's own thumbnail pipeline.

Getting the URLs right took two lessons. The first: TMDB serves localised artwork, so fetching a poster from a German connection quietly hands you German cover art. Adding `?image_language=en` fixes it.

The second was more embarrassing. TMDB ids are not guessable, and a wrong id does not throw an error, it just hands you a perfectly valid poster for a completely different film. While filling the tracker I confidently guessed ids that turned out to be The Wailing, Notes on Blindness, A Monster Calls, Dragon Ball Super, The Shallows and Let Him Go. None of that surfaced as an error. The only reason none of them shipped is that every lookup now has to confirm the page's own title back before the entry gets written.

That is the sort of failure worth designing around: not the one that crashes, but the one that looks entirely correct.
