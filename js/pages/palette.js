/**
 * Brand swatches page — accessory grid from assets/manifest.json (brand-swatches.html).
 */
(function () {
  function basePath() {
    var p = window.location.pathname;
    if (p.endsWith('/')) return p;
    if (/\.html?$/i.test(p)) return p.replace(/[^/]+$/, '');
    return p + '/';
  }

  function assetUrl(name) {
    return basePath() + 'assets/' + encodeURI(name.replace(/^\/+/, ''));
  }

  function fileStem(name) {
    return name.replace(/^.*\//, '').replace(/\.[^.]+$/, '');
  }

  function labelFromStem(stem) {
    return stem.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function cssVarFromStem(stem) {
    var slug = stem.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return '--color-' + slug;
  }

  function parseHex(hex) {
    if (!hex || typeof hex !== 'string') return null;
    var m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
    return m ? ('#' + m[1].toLowerCase()) : null;
  }

  function linChannel(c) {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  function luminanceHex(hex) {
    var h = parseHex(hex);
    if (!h) return 0;
    h = h.slice(1);
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 0.2126 * linChannel(r) + 0.7152 * linChannel(g) + 0.0722 * linChannel(b);
  }

  function contrastRatioHex(a, b) {
    var L1 = luminanceHex(a), L2 = luminanceHex(b);
    var hi = Math.max(L1, L2), lo = Math.min(L1, L2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function fillA11yFromHex(hex) {
    if (!parseHex(hex)) {
      return {
        topic: 'Text on this background color',
        verdict: 'Unknown',
        grade: '—/10',
        title: 'No color sample — contrast not computed.'
      };
    }
    var dark = '#1e2d3a';
    var light = '#ffffff';
    var cw = contrastRatioHex(light, hex);
    var cd = contrastRatioHex(dark, hex);
    var title = 'Contrast: white text ' + cw.toFixed(2) + ':1, dark text ' + cd.toFixed(2) + ':1 (AA needs 4.5:1 for normal-sized type).';
    if (cw >= 4.5) {
      title += ' White lettering on this color passes AA.';
      return { topic: 'White text on this color', verdict: 'Good', grade: '8/10', title: title };
    }
    if (cd >= 4.5) {
      title += ' Dark lettering on this color passes AA.';
      return { topic: 'Dark text on this color', verdict: 'Good', grade: '8/10', title: title };
    }
    if (cw >= 3 || cd >= 3) {
      return { topic: 'Text on this background color', verdict: 'Large text only', grade: '5/10', title: title };
    }
    return { topic: 'Text on this background color', verdict: 'Below AA', grade: '3/10', title: title };
  }

  function buildSwatchA11y(hex, missing) {
    var box = document.createElement('div');
    box.className = 'swatch-a11y';
    var row1 = document.createElement('div');
    row1.className = 'swatch-a11y-row';
    var t1 = document.createElement('span');
    t1.className = 'swatch-a11y-topic';
    var e1 = document.createElement('span');
    e1.className = 'swatch-a11y-eval';
    if (missing) {
      box.title = 'Image missing — no color sample.';
      t1.textContent = 'Color from image (not available)';
      e1.innerHTML = '<span class="swatch-a11y-verdict">Incomplete</span> · <span class="swatch-a11y-grade">—/10</span>';
    } else {
      var fa = fillA11yFromHex(hex);
      box.title = fa.title;
      t1.textContent = fa.topic;
      e1.innerHTML = '<span class="swatch-a11y-verdict">' + fa.verdict + '</span> · <span class="swatch-a11y-grade">' + fa.grade + '</span>';
    }
    row1.appendChild(t1);
    row1.appendChild(e1);
    box.appendChild(row1);
    return box;
  }

  function averageColor(img) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var w = 48, h = 48;
    canvas.width = w;
    canvas.height = h;
    try {
      ctx.drawImage(img, 0, 0, w, h);
    } catch (e) {
      return null;
    }
    var data = ctx.getImageData(0, 0, w, h).data;
    var r = 0, g = 0, b = 0, n = 0;
    for (var i = 0; i < data.length; i += 4) {
      var a = data[i + 3];
      if (a < 8) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      n++;
    }
    if (!n) return null;
    r = Math.round(r / n);
    g = Math.round(g / n);
    b = Math.round(b / n);
    return '#' + [r, g, b].map(function (x) {
      return x.toString(16).padStart(2, '0');
    }).join('');
  }

  function accessoryPaletteCell(url, stem, hex, missing, caption) {
    var varName = cssVarFromStem(fileStem(stem));
    var label = labelFromStem(fileStem(stem));
    var wrap = document.createElement('div');
    wrap.className = 'palette-six__item swatch' + (missing ? ' missing' : '');
    if (!missing && hex) {
      document.documentElement.style.setProperty(varName, hex);
    }

    var bar = document.createElement('div');
    bar.className = 'swatch-bar';

    var colorDiv = document.createElement('div');
    colorDiv.className = 'swatch-color';
    if (missing) {
      /* striped via CSS .missing .swatch-color */
    } else if (hex) {
      colorDiv.style.background = hex;
    } else {
      colorDiv.classList.add('swatch-thumb');
      colorDiv.style.backgroundImage = 'url("' + url.replace(/"/g, '\\"') + '")';
    }
    bar.appendChild(colorDiv);

    if (url) {
      if (!missing) {
        var ref = document.createElement('img');
        ref.className = 'swatch-ref';
        ref.src = url;
        ref.alt = 'Source: ' + fileStem(stem).replace(/-/g, ' ');
        ref.loading = 'lazy';
        bar.appendChild(ref);
      } else {
        var ph = document.createElement('div');
        ph.className = 'swatch-ref swatch-ref--missing';
        ph.title = 'Asset missing';
        bar.appendChild(ph);
      }
    }

    wrap.appendChild(bar);

    var meta = document.createElement('div');
    meta.className = 'swatch-meta';
    var code = document.createElement('code');
    code.textContent = missing ? '(missing) ' + fileStem(stem) : varName + ' · ' + hex;
    var span = document.createElement('span');
    span.textContent = missing ? fileStem(stem) : (caption || label);
    meta.appendChild(code);
    meta.appendChild(span);
    wrap.appendChild(meta);
    wrap.appendChild(buildSwatchA11y(hex, missing));
    return wrap;
  }

  function accessoryPlaceholderCell() {
    var wrap = document.createElement('div');
    wrap.className = 'palette-six__item swatch missing';
    var chip = document.createElement('div');
    chip.className = 'palette-six__chip';
    wrap.appendChild(chip);
    var meta = document.createElement('div');
    meta.className = 'swatch-meta';
    var code = document.createElement('code');
    code.textContent = '(empty slot)';
    var span = document.createElement('span');
    span.textContent = 'Add another accessory in manifest';
    meta.appendChild(code);
    meta.appendChild(span);
    wrap.appendChild(meta);
    wrap.appendChild(buildSwatchA11y(null, true));
    return wrap;
  }

  function accessoryShellCell() {
    var wrap = document.createElement('div');
    wrap.className = 'palette-six__item swatch';
    var chip = document.createElement('div');
    chip.className = 'palette-six__chip palette-six__chip--outline';
    chip.style.background = 'var(--color-white-shell)';
    wrap.appendChild(chip);
    var meta = document.createElement('div');
    meta.className = 'swatch-meta';
    var code = document.createElement('code');
    code.textContent = 'white-shell · #faf7f2';
    var span = document.createElement('span');
    span.textContent = 'Warm off-white · Accessory section';
    meta.appendChild(code);
    meta.appendChild(span);
    wrap.appendChild(meta);
    wrap.appendChild(buildSwatchA11y('#faf7f2', false));
    return wrap;
  }

  function renderAccessorySix(files, container, emptyEl, captionsByFile) {
    container.innerHTML = '';
    if (!files || !files.length) {
      emptyEl.hidden = false;
      return Promise.resolve();
    }
    emptyEl.hidden = true;
    var chain = Promise.resolve();
    var row = [];
    for (var i = 0; i < 5; i++) {
      (function (idx) {
        chain = chain.then(function () {
          if (idx >= files.length) {
            row[idx] = accessoryPlaceholderCell();
            return Promise.resolve();
          }
          var name = files[idx];
          var url = assetUrl(name);
          var cap = captionsByFile && captionsByFile[name];
          return loadImage(url).then(function (img) {
            var hex = averageColor(img);
            row[idx] = accessoryPaletteCell(url, name, hex, false, cap);
          }).catch(function () {
            row[idx] = accessoryPaletteCell(url, name, null, true, cap);
          });
        });
      })(i);
    }
    return chain.then(function () {
      for (var j = 0; j < 5; j++) {
        container.appendChild(row[j]);
      }
      container.appendChild(accessoryShellCell());
    });
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('load')); };
      img.src = url;
    });
  }

  var ACCESSORY_CAPTIONS = {
    'artisti-graded-blue-bg.jpg': 'Hero / atmosphere · graded blue wash',
    'artisti-darker-bg_black-text.jpg': 'Dark UI · teal + black type',
    'artisti-archivio-old-paper.png': 'Archive · warm old paper',
    'artisti-pink.jpg': 'Soft lilac accent',
    'artisti-red-extra-color.jpg': 'Urgent / CTA red'
  };

  fetch(assetUrl('manifest.json'))
    .then(function (r) {
      if (!r.ok) throw new Error('manifest');
      return r.json();
    })
    .then(function (data) {
      var accessory = data.accessory || [];
      return renderAccessorySix(
        accessory,
        document.getElementById('accessory-palette'),
        document.getElementById('accessory-empty'),
        ACCESSORY_CAPTIONS
      );
    })
    .catch(function () {
      var empty = document.getElementById('accessory-empty');
      empty.hidden = false;
      empty.textContent = 'Could not load assets/manifest.json. Ensure it exists and GitHub Pages has finished deploying.';
    });
})();
