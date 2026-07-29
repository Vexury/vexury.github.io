---
title: "🤑 Kenney Jam 2026: Scaleton Inc."
date: 2026-07-19
summary: "Fifty hours, a team of three, and a jam where you are not allowed to make any art. What you can make is shaders."
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

[Kenney Jam 2026](https://itch.io/jam/kenney-jam-2026) ran from **July 17 to July 19, 2026**, a 50 hour window. The theme: **Scale**.

The rule that defines this jam is not the theme, it is the assets. You may only use game assets made by [Kenney](https://kenney.nl/assets/) or [KayKit](https://kaylousberg.itch.io/). No custom art, no custom models, not even the placeholder meshes that ship with your engine. You can recolor, crop, rotate and combine, and that is it.

What the rules *do* allow is custom materials, shaders, VFX and particles, plus custom audio. That gap turns out to shape the whole jam, and I will come back to it at the end.

I went in with a team of three: myself on programming, systems and UI, [cxbane](https://cxbane.zone) on art direction and audio, and Roby on level design and playtesting.

## The Game

Scaleton is a skeleton who got tired of fighting heroes and opened a shop instead. He sells weapons, supplies and knowledge to whatever wanders into the dungeon, heroes and monsters alike. You are not Scaleton exactly, you are the hand that keeps his business running.

Everything is a click. You click customers to serve them, click thieves before they reach the door, and click the rats that keep scurrying through the shop. Between all of that you spend what you earn on making the shop bigger.

Our reading of the theme was scale as in *scaling a business*, not scale as in physical size. Given that half the jam went for size jokes, the tycoon angle gave us room that felt less crowded.

## The Customer Pipeline

Customers are NavMesh agents. They spawn near the entrance and then work through a list of stations in order, browsing before they arrive at the counter to pay.

The part that keeps it from looking mechanical is that some stations pick randomly between alternatives. There are several tables and shelves carrying wares, so two customers running the same station order still walk different paths through the room. It is a cheap trick and it does a lot of work: the shop reads as a place with traffic rather than a conveyor belt.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_04.png', 1100 %}" alt="A customer being served at the counter with a radial progress timer above them" loading="lazy" style="width:100%">
</div>

Then there is the branch that makes the loop interesting. Every customer has a chance to skip checkout entirely and head straight for the exit with the goods. Under the hood a thief is not a special entity, it is the same agent taking a different route, which is exactly why the mechanic works: you cannot identify a thief by looking at them, only by noticing that they never stopped at the counter. Catching one means clicking them before they get out, and you get the money back.

That single rule is what forces you to actually watch the shop instead of clicking the counter on autopilot.

## Two Currencies

The upgrade system splits into two windows, and the split is the spine of the whole design.

**Gold** buys throughput. Faster spawn rates, shorter customer processing times, and new rooms to expand into. Gold makes the shop busier.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_02.png', 1100 %}" alt="An unlockable storage room stocked with crates, barrels and produce" loading="lazy" style="width:100%">
</div>

**Reputation** buys automation, through the tech tree. A fire staff that hovers over the dungeon and shoots rats so you stop having to chase them. A bouncer who prevents stealing. Customers who start leaving extra tips. And automation itself, which is bought per department rather than as a single switch: the weapon shop, the grocery shop and the magic shop each learn to run themselves separately, so you choose which part of the business stops needing you first. All of it is ScriptableObject driven, which made adding and rebalancing upgrades during the jam a matter of editing assets rather than touching code.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_06.png', 1100 %}" alt="The tech tree window, showing reputation-cost upgrade nodes connected in a branching layout" loading="lazy" style="width:100%">
</div>

The relationship between the two is the bit I like most. Reputation comes from clicking the mice that speed through the shop, so the currency that buys you *less clicking* is itself paid for in clicks. Early on you are serving every customer by hand, catching every thief by hand, and squashing every rat by hand. The game taxes your attention, and then sells you a way out of it with the very resource that tax generates.

<div style="margin:1.5rem 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_03.png', 1100 %}" alt="An unlockable study room with scrolls, tomes and a wizard customer" loading="lazy" style="width:100%">
</div>

Gold makes the shop demand more of you. Reputation gives you back the capacity to handle it. Progress is the gap between those two closing.

## The Torch

The piece I am most proud of is a torch. That sounds small until you remember the constraint.

In a jam where every mesh and every texture is premade and shared with every other entrant, shaders and VFX are the only visual layer you actually author. The torch is a Shader Graph and particle system combo, and it is doing most of the work in these screenshots: the warm pooling light, the flicker, the way the low-poly stone reads as a dungeon rather than a grey box.

It also paid for itself twice. When the anti-rat staff went into the tech tree and needed a projectile, the fireball came straight out of the torch effect with a different setup. One effect, built well early, covering both the ambient lighting of the entire shop and a gameplay VFX we did not know we needed yet.

<div style="text-align:center; margin:1.5rem 0">
  <video autoplay loop muted playsinline style="max-width:80%">
    <source src="/images/Scaleton/Scaleton_VFX.mp4" type="video/mp4">
  </video>
</div>

Everyone in this jam is building out of the same box of parts. The lighting and the particles are the part that is yours.

## Retrospective

Nothing broke. That is an unusual thing to write about a 50 hour jam.

The pacing landed too. Gold and reputation income lined up with the costs of the final upgrades closely enough that the curve just worked, and the last tech tree purchase ends the game by telling you that you successfully scaled Scaleton's business and made his dream come true. Getting an economy to resolve cleanly inside a weekend is usually the thing that does not happen.

I suspect the reason is the third person on the team. My previous jams have mostly been two people, and my instinct going in was that a third slot should go to another programmer. It should not. Roby spent the jam playing the game constantly, placing assets and tweaking numbers, which meant the balance was being tested continuously instead of in one panicked pass at the end. A dedicated set of eyes on pace and feel caught things that neither of us building the parts would have noticed.

Coming off the [Juniper jam](/posts/008_JuniperDevGameJam/), where I split myself across two teams as primary programmer on both, this was the clearer lesson: one team, and the extra person playtests.

<div style="margin:2rem 0 0">
  <img src="{% thumb '/images/Scaleton/Scaleton_05.png', 1100 %}" alt="Close-up of Scaleton behind the counter with a stack of gold, lit by torchlight" loading="lazy" style="width:100%">
</div>
