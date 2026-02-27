/* ========================================
   KREON PROJECTS — Calculator Logic
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- State ----
    let roomBase = 850;       // per sq ft base cost
    let area = 500;
    let qualityMultiplier = 1;
    let addonsTotal = 0;

    // ---- DOM refs ----
    const totalCostEl = document.getElementById('totalCost');
    const totalCostFullEl = document.getElementById('totalCostFull');
    const areaSlider = document.getElementById('areaSlider');
    const areaValueEl = document.getElementById('areaValue');
    const qualityTextEl = document.getElementById('qualityText');
    const qualityBadge = document.getElementById('qualityBadge');
    const roomScene = document.getElementById('roomScene');
    const getQuoteBtn = document.getElementById('getQuoteBtn');

    // Breakdown
    const costMaterial = document.getElementById('costMaterial');
    const costLabour = document.getElementById('costLabour');
    const costFurnishing = document.getElementById('costFurnishing');
    const costOverhead = document.getElementById('costOverhead');
    const barMaterial = document.getElementById('barMaterial');
    const barLabour = document.getElementById('barLabour');
    const barFurnishing = document.getElementById('barFurnishing');
    const barOverhead = document.getElementById('barOverhead');

    // ---- Room Type Selection ----
    document.querySelectorAll('.room-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.room-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            roomBase = parseInt(btn.dataset.base, 10);

            // Update 3D room color theme
            const room = btn.dataset.room;
            updateRoomPreview(room);
            calculate();
        });
    });

    // ---- Area Slider ----
    areaSlider.addEventListener('input', () => {
        area = parseInt(areaSlider.value, 10);
        areaValueEl.textContent = area.toLocaleString();
        updatePresets();
        calculate();
    });

    // ---- Area Presets ----
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.dataset.area, 10);
            areaSlider.value = val;
            area = val;
            areaValueEl.textContent = val.toLocaleString();
            updatePresets();
            calculate();
        });
    });

    function updatePresets() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.area) === area);
        });
    }

    // ---- Quality Tier ----
    document.querySelectorAll('.quality-option').forEach(opt => {
        const radio = opt.querySelector('input');
        opt.addEventListener('click', () => {
            document.querySelectorAll('.quality-option').forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            radio.checked = true;
            qualityMultiplier = parseFloat(radio.value);
            const labels = { '1': 'Standard', '1.6': 'Premium', '2.5': 'Luxury' };
            qualityTextEl.textContent = labels[radio.value] || 'Standard';

            // Update 3D preview quality colors
            updateQualityPreview(radio.value);
            calculate();
        });
    });

    // ---- Add-ons ----
    document.querySelectorAll('#addonsList input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            addonsTotal = 0;
            document.querySelectorAll('#addonsList input:checked').forEach(c => {
                addonsTotal += parseInt(c.dataset.cost, 10);
            });
            calculate();
        });
    });

    // ---- Calculate ----
    function calculate() {
        const baseCost = area * roomBase * qualityMultiplier;
        const total = baseCost + addonsTotal;

        // Animate cost
        animateValue(totalCostEl, total);
        totalCostFullEl.textContent = '₹' + total.toLocaleString('en-IN');

        // Breakdown
        const materialCost = Math.round(total * 0.40);
        const labourCost = Math.round(total * 0.25);
        const furnishingCost = Math.round(total * 0.20);
        const overheadCost = total - materialCost - labourCost - furnishingCost;

        costMaterial.textContent = '₹' + materialCost.toLocaleString('en-IN');
        costLabour.textContent = '₹' + labourCost.toLocaleString('en-IN');
        costFurnishing.textContent = '₹' + furnishingCost.toLocaleString('en-IN');
        costOverhead.textContent = '₹' + overheadCost.toLocaleString('en-IN');

        // Update get-quote link
        const roomType = document.querySelector('.room-type-btn.active')?.querySelector('span:last-child')?.textContent || '';
        const qualityLabel = qualityTextEl.textContent;
        const msg = `I used the cost calculator and my estimate is ₹${total.toLocaleString('en-IN')} for a ${area} sq ft ${roomType} (${qualityLabel} tier).`;
        getQuoteBtn.href = `contact.html?project=${encodeURIComponent(roomType)}&msg=${encodeURIComponent(msg)}`;
    }

    // ---- Animate Value ----
    let animFrame;
    function animateValue(el, target) {
        const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
        const diff = target - current;
        const steps = 30;
        let step = 0;

        cancelAnimationFrame(animFrame);

        function tick() {
            step++;
            const progress = step / steps;
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(current + diff * eased);
            el.textContent = value.toLocaleString('en-IN');

            if (step < steps) {
                animFrame = requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString('en-IN');
            }
        }
        tick();
    }

    // ---- 3D Room Preview Updates ----
    function updateRoomPreview(room) {
        const rotations = {
            living: 'rotateX(15deg) rotateY(-25deg)',
            bedroom: 'rotateX(12deg) rotateY(-35deg)',
            kitchen: 'rotateX(18deg) rotateY(-20deg)',
            bathroom: 'rotateX(20deg) rotateY(-30deg)',
            office: 'rotateX(14deg) rotateY(-22deg)',
            complete: 'rotateX(10deg) rotateY(-28deg)',
        };
        if (roomScene) {
            roomScene.style.transform = rotations[room] || rotations.living;
        }

        // Update floor colors per room
        const floor = document.getElementById('roomFloor');
        const colors = {
            living: 'linear-gradient(135deg, #2a2a3d, #1e1e30)',
            bedroom: 'linear-gradient(135deg, #2d2535, #1e1a28)',
            kitchen: 'linear-gradient(135deg, #2a3030, #1e2828)',
            bathroom: 'linear-gradient(135deg, #252a35, #1a2028)',
            office: 'linear-gradient(135deg, #2d2d3d, #202030)',
            complete: 'linear-gradient(135deg, #2a2838, #1e1c2e)',
        };
        if (floor) floor.style.background = colors[room] || colors.living;
    }

    function updateQualityPreview(val) {
        const sofa = document.getElementById('furnitureSofa');
        const glow = {
            '1': '0 4px 12px rgba(201, 168, 76, .2)',
            '1.6': '0 6px 20px rgba(201, 168, 76, .35)',
            '2.5': '0 8px 30px rgba(201, 168, 76, .5)',
        };
        const scale = { '1': 'scale(1)', '1.6': 'scale(1.03)', '2.5': 'scale(1.06)' };

        if (sofa) {
            sofa.style.boxShadow = glow[val] || glow['1'];
            sofa.style.transform = scale[val] || 'scale(1)';
        }

        if (qualityBadge) {
            const colors = { '1': 'rgba(201, 168, 76, .1)', '1.6': 'rgba(201, 168, 76, .2)', '2.5': 'rgba(201, 168, 76, .35)' };
            qualityBadge.style.background = colors[val] || colors['1'];
        }
    }

    // ---- Initial Calculation ----
    calculate();
});
