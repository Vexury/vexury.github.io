---
title: "🧟 Mini Jame Gam #55: Necrocure"
date: 2026-05-31
summary: "A 58-hour jam about alien abductions, necromantic cows, and a dying planet that needs milk. Built in Unity with Cxbane."
preview_image: /images/Necrocure/Necrocure_001.png
---

# {{ title }}
<br>
<div class="link-row" style="margin-bottom: 1rem">
<a href="https://vexury.itch.io/necrocure" class="link-btn">Game Page <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-0.1em"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg></a>
<a href="https://github.com/Vexury/Necrocure-Mini-Game-Jam-55" class="link-btn">GitHub <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style="vertical-align:-0.1em"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></a>
</div>

The [Mini Jame Gam #55](https://itch.io/jam/mini-jame-gam-55) ran from **Friday May 29 at 1 PM to Sunday May 31 at 11:30 PM**, just under 58 hours. I teamed up with [Cxbane](https://cxbane.zone), who handled all the art direction and audio while I took care of programming, VFX and UI in Unity (6000.4.9f1 URP).

The theme was announced at the start of the jam: **Necromancy**, with **Milk** as the mandatory special object to include somewhere in the game. 
Time for some classic "aliens-come-to-a-farm-and-adbduct-cows-who-couldn't-care-less".

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/Necrocure/Necrocure_001.png', 1100 %}" alt="Necrocure concept" style="max-width:80%" loading="lazy">
</div>

## The Concept

The concept we landed on: A crazed farmer on Earth used necromancy to resurrect his dead cows. Resurrected cows still produce milk, and milk means profit. Meanwhile, you play an alien race and your home planet is dying, and that very same necro-milk turns out to be the cure. So you arrive in your UFO, hover over the farm, and get to work.

The twist is that you can't just abduct any cow. You need to identify the *resurrected* ones among the herd and pull them up with your traction beam. Collect enough necro-milk and make it back to the portal before the three-minute timer runs out. Left-clicking makes the cows moo, which turned out to be both mechanically useful and extremely funny during playtesting.

<div style="text-align: center; margin: 1.5rem 0">
  <img src="{% thumb '/images/Necrocure/Necrocure_002.png', 1100 %}" alt="Necrocure gameplay" style="max-width:80%" loading="lazy">
</div>

## Art and VFX

Cxbane's art direction gave the game its identity immediately. The farm aesthetic against the alien visitor framing created exactly the absurd-but-coherent tone we were going for. 
On my end, the most interesting technical work was the VFX: the traction beam and the space portal took me some time to create with Particle Systems (no Visual Effect Graph sadly because we needed to make a web build) and Shader Graph.

<div style="text-align: center; margin: 1.5rem 0">
  <video autoplay loop muted playsinline style="max-width:80%">
    <source src="/images/Necrocure/Necrocure_VFX.mp4" type="video/mp4">
  </video>
</div>


## Scoring and Retrospective

The scoring system ended up simple: 10 milk to cure your planet (one star), 11 for two stars, 12 for three stars. Enough to make the run feel repeatable without overstaying its welcome. Most players really wanted to get three stars after returning with 10 milk in the first run.

Mini Jame Gam #55 was my second jam, and the difference from the first was noticeable: less time figuring out what a game jam even is, more time actually making the game. Cxbane was a great collaborator. The audio and visuals came in steadily throughout the weekend and made the game feel finished well before the deadline.

Necromancy and milk made for a surprisingly coherent game!

<div style="display:grid; grid-template-columns:repeat(7,1fr); gap:0.35rem; margin:1.5rem 0">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_01.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_01.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_02.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_02.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_03.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_03.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_04.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_04.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_05.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_05.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_06.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_06.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
  <img class="nc-art" src="{% thumb '/images/Necrocure/Necrocure_Cxbane_07.png', 200 %}" data-full="/images/Necrocure/Necrocure_Cxbane_07.png" alt="Art by Cxbane" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:3px;cursor:zoom-in;border:2px solid var(--border-mid)" loading="lazy">
</div>
<p style="text-align:center;font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.1em;margin-top:-0.5rem;margin-bottom:1.5rem">Art by <a href="https://cxbane.zone" style="color:inherit;border-bottom:1px solid var(--border-mid)">Cxbane</a></p>

<div class="lightbox" id="nc-lb"><img id="nc-lb-img" src="" alt="Art by Cxbane"></div>

<script>
(function() {
  var lb = document.getElementById('nc-lb');
  var lbImg = document.getElementById('nc-lb-img');
  document.querySelectorAll('img.nc-art').forEach(function(img) {
    img.addEventListener('click', function() { lbImg.src = img.dataset.full; lb.classList.add('active'); });
  });
  lb.addEventListener('click', function() { lb.classList.remove('active'); lbImg.src = ''; });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') { lb.classList.remove('active'); lbImg.src = ''; } });
})();
</script>

<!-- itch.io widget: replace APP_ID with your numeric app ID (find it in the URL at itch.io > Necrocure > Edit) -->
<div style="display:flex; justify-content:center; margin: 1.5rem 0">
  <iframe frameborder="0" src="https://itch.io/embed/4630073?border_width=2&amp;bg_color=03122e&amp;fg_color=ffffff&amp;link_color=3cfdb9&amp;border_color=07986d" width="554" height="169"><a href="https://vexury.itch.io/necrocure">Necrocure by Vexury, Cxbane</a></iframe>
</div>