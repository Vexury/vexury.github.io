---
title: "🤑 Kenney Jam 2026: Scaleton Inc."
date: 2026-07-19
summary: "A 50-hour jam with a team of three, where custom art is forbidden but custom shaders are allowed."
preview_image: /images/Scaleton/Scaleton_Cover.png
---

# {{ title }}

<p class="post-date">{{ date | date: "%B %d, %Y" }}</p>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://vexury.itch.io/scaleton-inc" class="link-btn">Scaleton Inc. <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
</div>

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_01.png', 1100 %}" alt="Scaleton Inc. shop interior with customers queuing at the counter" loading="lazy" style="width:100%">
</div>

[Kenney Jam 2026](https://itch.io/jam/kenney-jam-2026) ran from July 17 to July 19, 2026, a 50 hour window, and the theme was **Scale**.

The special thing about this jam is the asset rule. You may only use game assets made by [Kenney](https://kenney.nl/assets/) or [KayKit](https://kaylousberg.itch.io/), so no custom art, no custom models and not even the placeholder meshes that come with your engine. You can recolor, crop, rotate and combine them, and that's it.
Custom materials, shaders, VFX, particles and audio are allowed though, and that ended up shaping the whole jam for us (more on that at the end).

We were a team of three: me on programming, systems and UI, [cxbane](https://cxbane.zone) on art direction and audio, and Roby on level design and playtesting.

## The Game

Scaleton is a skeleton who got tired of fighting heroes and opened a shop instead. He sells weapons, supplies and knowledge to whatever wanders into the dungeon, heroes and monsters alike. You play the hand that keeps his business running.

Everything is a click. You click customers to serve them, click thieves before they reach the door and click the rats that keep running through the shop. In between, you spend what you earn to make the shop bigger.

We read the theme as *scaling a business*. About half of the jam went for size jokes, so the tycoon idea gave us a bit more room.

## The Customer Pipeline

Customers are NavMesh agents. They spawn near the entrance and go through a list of stations in order, browsing before they get to the counter to pay.

Some stations pick randomly between alternatives, because there are several tables and shelves with wares. So two customers with the same station order still walk different paths through the room. It's a cheap trick, and the shop looks a lot less mechanical with it.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_04.png', 1100 %}" alt="A customer being served at the counter with a radial progress timer above them" loading="lazy" style="width:100%">
</div>

Every customer also has a chance to skip the checkout and walk straight to the exit with the goods. A thief is the same agent as everyone else, just taking a different route. That's why the mechanic works: you can't tell a thief by looking at them, only by noticing that they never stopped at the counter. If you click them before they get out, you get the money back.
This makes you actually watch the shop instead of clicking the counter on autopilot.

## Two Currencies

The upgrades are split into two windows with two currencies, and most of the design is built around that split.

Gold buys throughput: faster spawn rates, shorter processing times per customer and new rooms to expand into. With gold, the shop gets busier.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_02.png', 1100 %}" alt="An unlockable storage room stocked with crates, barrels and produce" loading="lazy" style="width:100%">
</div>

Reputation buys automation through the tech tree: a fire staff that hovers over the dungeon and shoots the rats so you don't have to chase them, a bouncer who stops thieves and customers who leave extra tips.
Automation itself is bought per department, so the weapon shop, the grocery shop and the magic shop each learn to run on their own, and you decide which part of the business stops needing you first.
All of it is driven by ScriptableObjects, so adding and rebalancing upgrades during the jam meant editing assets instead of touching code.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_06.png', 1100 %}" alt="The tech tree window, showing reputation-cost upgrade nodes connected in a branching layout" loading="lazy" style="width:100%">
</div>

The part I like most is how the two currencies relate. Reputation comes from clicking the mice that speed through the shop, so the currency that buys you *less clicking* is itself paid for in clicks.
Early on you serve every customer, catch every thief and squash every rat by hand, and then you use the reputation from all that clicking to buy your way out of it.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_03.png', 1100 %}" alt="An unlockable study room with scrolls, tomes and a wizard customer" loading="lazy" style="width:100%">
</div>

So gold makes the shop demand more from you and reputation gives you the capacity to handle it. You make progress as the gap between the two closes.

## The Torch

The thing I am most proud of is a torch, which sounds small, but remember the asset rule.
In this jam every mesh and texture is premade and shared with everyone else, so shaders and VFX are the only visual layer you actually make yourself.
The torch is a combination of Shader Graph and a particle system, and it does most of the work in these screenshots: the warm light, the flicker and the low-poly stone looking like a dungeon instead of a grey box.

It also paid off twice. When the anti-rat staff went into the tech tree and needed a projectile, the fireball came straight out of the torch effect with a different setup.
So one effect that I built early covers the lighting of the whole shop and a gameplay VFX we did not even know we needed yet.

<div style="text-align:center; margin:1.5rem 0">
  <video autoplay loop muted playsinline style="max-width:80%">
    <source src="/images/Scaleton/Scaleton_VFX.mp4" type="video/mp4">
  </video>
</div>

Everyone in this jam builds from the same box of parts, so the lighting and the particles are what makes the game look like your own.

## Retrospective

Nothing broke, which is rare for a 50 hour jam.

The pacing worked out too. Gold and reputation income matched the costs of the final upgrades closely enough that the curve just worked, and the last tech tree purchase ends the game by telling you that you successfully scaled Scaleton's business and made his dream come true. Getting an economy to work out within a weekend usually doesn't happen.

I think the reason is the third person on the team. Most of my previous jams were two people, and going in I thought a third slot should go to another programmer. That was wrong.
Roby spent the jam playing the game constantly, placing assets and tweaking numbers, so the balance got tested the whole time and not in one panicked pass at the end. Having someone focused on pace and feel caught things that neither of us building the parts would have noticed.

After the [Juniper jam](/posts/008_JuniperDevGameJam/), where I was the main programmer in two teams at once, my takeaway is: one team, and the extra person playtests.

<div style="margin:2rem 0 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_05.png', 1100 %}" alt="Close-up of Scaleton behind the counter with a stack of gold, lit by torchlight" loading="lazy" style="width:100%">
</div>
