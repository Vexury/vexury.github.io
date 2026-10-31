---
title: "🎬 A Show Tracker Built From One JSON File"
date: 2026-08-24
summary: "A static tracker for the horror, mystery and thriller films and series I watched, built from one JSON file, plus two things I learned about TMDB posters the hard way."
preview_image: /images/ShowTracker_Preview.jpg
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="/show-tracker/" class="link-btn">Open the Show Tracker</a>
</div>

I wanted a place to keep track of the horror, mystery and thriller films and series I have watched, with a rating for each one. No Letterboxd account, just a page on my own site that loads instantly.
The site already builds with Eleventy and deploys through GitHub Actions, so the simplest solution was to put the data into a file in the repo and let the existing pipeline do the rest.

The result is at [/show-tracker/](/show-tracker/) and has three sections: a hall of fame, a watchlist and the full collection of everything I watched.

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

The `status` field (`watchlist`, `watched` or `hall_of_fame`) decides in which sections an entry shows up, and the three groups are filtered from that one array at build time.
There is no client-side state at all (no localStorage, no forms, no fetch). To rate something, I edit its `rating` field and push the commit. I actually prefer that, because the data is versioned and I can't lose it when some service shuts down.

## Sorting with Liquid

Grouping is easy with Liquid's `where` and `where_exp`, but sorting was not. Liquid's `sort` filter only takes a single property, has no descending option and, even worse, sorts `null` before everything else. So my unrated watchlist entries ended up at the very top, above the 10s.

That's why the sorting moved into two small filters in `.eleventy.js`:

```js
eleventyConfig.addFilter("sortByRatingDesc", function (arr) {
  return [...(arr || [])].sort((a, b) =>
    (b.rating ?? -1) - (a.rating ?? -1) || a.title.localeCompare(b.title));
});
```

It sorts by two keys in descending order, puts unrated entries at the bottom and breaks ties alphabetically, so the order stays the same between builds. It runs once at build time.

## Posters from TMDB

The posters are hotlinked from TMDB's image CDN instead of committed to the repo. That keeps a hundred-odd JPEGs out of git, but they skip the site's own thumbnail pipeline.

I had to learn two things to get the URLs right. First, TMDB serves localised artwork, so if you fetch a poster from a German connection, you get the German cover art without noticing. Adding `?image_language=en` fixes that.

The second one was more embarrassing. TMDB ids can't be guessed, and a wrong id does not throw an error, you just get a perfectly valid poster of a completely different film. While filling the tracker, I guessed ids that turned out to be The Wailing, Notes on Blindness, A Monster Calls, Dragon Ball Super, The Shallows and Let Him Go.
None of this showed up as an error, and the only reason none of them are on the site is that every lookup now has to confirm the page's own title before the entry gets written.
