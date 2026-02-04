// --- UTILITIES ---

// Multi-segment state (must be declared before toggleMode uses them)
let multiSegTotalMins = 0;
let multiSegSelectedMins = 0;
let multiSegAnswered = false;

// Field verification state for prefilled fields
let verifiedFields = { dutyDate: false, homeBase: false };

function verifyField(fieldId) {
    const field = document.getElementById(fieldId);
    const btn = document.getElementById(fieldId + 'OkBtn');

    if (field && btn) {
        // Mark as verified
        verifiedFields[fieldId] = true;

        // Update field styling - green border and background for unified look
        field.classList.remove('border-amber-400', 'bg-gray-50');
        field.classList.add('border-green-500', 'bg-green-50');

        // Update button styling - green confirmed state
        btn.classList.remove('bg-amber-100', 'text-amber-700', 'border-amber-400');
        btn.classList.add('bg-green-500', 'text-white', 'border-green-500');
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.disabled = true;
        btn.classList.add('cursor-default');
    }
}

function resetVerifyFields() {
    // Reset verification state but keep values
    ['dutyDate', 'homeBase'].forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const btn = document.getElementById(fieldId + 'OkBtn');

        if (field && btn) {
            verifiedFields[fieldId] = false;

            // Reset field styling to amber/gray
            field.classList.remove('border-green-500', 'bg-green-50');
            field.classList.add('border-amber-400', 'bg-gray-50');

            // Reset button styling
            btn.classList.remove('bg-green-500', 'text-white', 'border-green-500', 'cursor-default');
            btn.classList.add('bg-amber-100', 'text-amber-700', 'border-amber-400');
            btn.innerHTML = 'Verify';
            btn.disabled = false;
        }
    });
}

// Handle Yes/No modifier answers
function answerModifier(fieldId, isYes) {
    const hiddenInput = document.getElementById(fieldId);
    const questionDiv = hiddenInput.closest('.modifier-question');
    const noBtn = document.getElementById(fieldId + '_no');
    const yesBtn = document.getElementById(fieldId + '_yes');

    // Set the value
    hiddenInput.value = isYes ? 'true' : 'false';

    // Update question styling - green border when answered, clear any missing state
    questionDiv.classList.remove('border-amber-400', 'bg-amber-50', 'modifier-missing');
    questionDiv.classList.add('border-green-500', 'bg-green-50');

    // Update button styling
    if (isYes) {
        yesBtn.classList.remove('bg-white', 'border-gray-300');
        yesBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        noBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
        noBtn.classList.add('bg-white', 'border-gray-300');
    } else {
        noBtn.classList.remove('bg-white', 'border-gray-300');
        noBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        yesBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
        yesBtn.classList.add('bg-white', 'border-gray-300');
    }

    // Blur button to clear focus state on mobile
    if (isYes) yesBtn.blur();
    else noBtn.blur();

    resetResult();
}

// Handle Co-Terminal modifier answer
function answerCoTermModifier(isYes) {
    const questionDiv = document.getElementById('coTermQuestion');
    const hiddenInput = document.getElementById('isCoTerm');
    const selectEl = document.getElementById('coTermSelect');
    const noBtn = document.getElementById('coTerm_no');
    const yesBtn = document.getElementById('coTerm_yes');

    if (isYes) {
        // Show select dropdown
        selectEl.classList.remove('hidden');
        // Update button styling
        yesBtn.classList.remove('bg-white', 'border-gray-300');
        yesBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        noBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
        noBtn.classList.add('bg-white', 'border-gray-300');
        // Don't mark green yet - needs select
    } else {
        // Hide select, mark as answered
        selectEl.classList.add('hidden');
        hiddenInput.value = 'false';
        // Update button styling
        noBtn.classList.remove('bg-white', 'border-gray-300');
        noBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        yesBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
        yesBtn.classList.add('bg-white', 'border-gray-300');
        // Mark green, clear any missing state
        questionDiv.classList.remove('border-amber-400', 'bg-amber-50', 'modifier-missing');
        questionDiv.classList.add('border-green-500', 'bg-green-50');
    }

    resetResult();
}

// Handle co-terminal selection
function selectCoTerminal() {
    const selectEl = document.getElementById('coTermSelect');
    const questionDiv = document.getElementById('coTermQuestion');
    const hiddenInput = document.getElementById('isCoTerm');

    if (selectEl.value) {
        hiddenInput.value = selectEl.value;
        questionDiv.classList.remove('border-amber-400', 'bg-amber-50', 'modifier-missing');
        questionDiv.classList.add('border-green-500', 'bg-green-50');
    }

    resetResult();
}

// Reset modifiers to unanswered state
function resetModifiers() {
    ['isHVT', 'isDHD', 'customsEnd', 'isCoTerm'].forEach(fieldId => {
        const hiddenInput = document.getElementById(fieldId);
        const questionDiv = hiddenInput?.closest('.modifier-question');
        const noBtn = document.getElementById(fieldId.replace('is', '').toLowerCase() + '_no') || document.getElementById(fieldId + '_no');
        const yesBtn = document.getElementById(fieldId.replace('is', '').toLowerCase() + '_yes') || document.getElementById(fieldId + '_yes');

        if (hiddenInput) hiddenInput.value = '';
        if (questionDiv) {
            questionDiv.classList.remove('border-green-500', 'bg-green-50');
            questionDiv.classList.add('border-amber-400', 'bg-amber-50');
        }
        if (noBtn) {
            noBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            noBtn.classList.add('bg-white', 'border-gray-300');
        }
        if (yesBtn) {
            yesBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            yesBtn.classList.add('bg-white', 'border-gray-300');
        }
    });

    // Hide co-terminal select
    const coTermSelect = document.getElementById('coTermSelect');
    if (coTermSelect) coTermSelect.classList.add('hidden');
}

function copyReceipt() {
    const txt = `C9 Duty Check:\nReport: ${lastCalc.rTime} ${lastCalc.rAir} (${lastCalc.hdt} ${lastCalc.hb} Time)\nScheduled FLT Time: ${lastCalc.flt}\nMax Duty: ${lastCalc.max}\nHard Stop: ${lastCalc.hardStop}\nDeductions: ${lastCalc.deducts.join(', ')}\nLATEST DOOR CLOSE: ${lastCalc.final}\n(Generated by C9 Duty Max)`;
    const ta = document.getElementById('copyArea');
    ta.value = txt;
    ta.select();
    document.execCommand('copy');
    const btn = document.querySelector('#resultCard button i');
    btn.className = "fa-solid fa-check text-green-400";
    setTimeout(() => btn.className = "fa-regular fa-copy", 1500);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('darkModeIcon');
    const themeMeta = document.getElementById('themeColor');

    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon'); icon.classList.add('fa-sun');
        themeMeta.content = "#1f2937";
    } else {
        icon.classList.remove('fa-sun'); icon.classList.add('fa-moon');
        themeMeta.content = "#002244";
    }
    validateAirport(document.getElementById('reportAirport'));
    validateAirport(document.getElementById('depAirport'));
}

function toggleMode() {
    const isDom = document.getElementById('modeDom').checked;
    const isInt = document.getElementById('modeInt').checked;
    const hvtQuestion = document.getElementById('isHVT')?.closest('.modifier-question');
    const multiSegCont = document.getElementById('multiSegContainer');
    const domCheck = document.getElementById('domCheck');
    const intCheck = document.getElementById('intCheck');

    // Enable form when mode is selected
    if (isDom || isInt) {
        setFormDisabledState(false);
        // Clear mode error styling
        document.getElementById('modeDomLabel')?.classList.remove('mode-missing');
        document.getElementById('modeIntLabel')?.classList.remove('mode-missing');
    }

    // Toggle checkmarks
    if (domCheck) domCheck.classList.toggle('hidden', !isDom);
    if (intCheck) intCheck.classList.toggle('hidden', !isInt);

    if (isDom) {
        // Enable HVT question for domestic
        if (hvtQuestion) {
            hvtQuestion.style.opacity = "1";
            // Restore HVT buttons to Yes/No
            const hvtYes = document.getElementById('isHVT_yes');
            const hvtNo = document.getElementById('isHVT_no');
            const hvtHidden = document.getElementById('isHVT');
            if (hvtYes) {
                hvtYes.textContent = 'Yes';
                hvtYes.disabled = false;
            }
            if (hvtNo) {
                hvtNo.textContent = 'No';
                hvtNo.disabled = false;
            }
            // Reset hidden value so user must answer again
            if (hvtHidden) hvtHidden.value = '';
            // Reset question styling to amber (unanswered)
            hvtQuestion.classList.remove('border-gray-300', 'bg-gray-100', 'border-green-500', 'bg-green-50');
            hvtQuestion.classList.add('border-amber-400', 'bg-amber-50');
        }
        // Hide multi-segment for domestic
        if (multiSegCont) multiSegCont.classList.add('hidden');
        multiSegTotalMins = 0;
        multiSegSelectedMins = 0;
        multiSegAnswered = false;
        resetMultiSegButtons();
    } else {
        // Disable/dim HVT question for international (HVT doesn't apply)
        if (hvtQuestion) {
            hvtQuestion.style.opacity = "0.5";
            // Reset HVT buttons to unselected state
            const hvtYes = document.getElementById('isHVT_yes');
            const hvtNo = document.getElementById('isHVT_no');
            const hvtHidden = document.getElementById('isHVT');
            if (hvtYes) {
                hvtYes.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
                hvtYes.classList.add('bg-white', 'border-gray-300');
                hvtYes.textContent = 'N/A';
                hvtYes.disabled = true;
            }
            if (hvtNo) {
                hvtNo.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
                hvtNo.classList.add('bg-white', 'border-gray-300');
                hvtNo.textContent = 'N/A';
                hvtNo.disabled = true;
            }
            if (hvtHidden) hvtHidden.value = 'false'; // Set to false for intl
            // Reset question styling to neutral gray
            hvtQuestion.classList.remove('border-amber-400', 'bg-amber-50', 'border-green-500', 'bg-green-50', 'modifier-missing');
            hvtQuestion.classList.add('border-gray-300', 'bg-gray-100');
        }
        // Keep multi-segment question hidden initially - shown when flight time is entered
        if (multiSegCont) multiSegCont.classList.add('hidden');
        resetMultiSegButtons();
    }
    resetResult();
}

// Disable/enable form fields based on mode selection
function setFormDisabledState(disabled) {
    // Get all input fields, selects, and buttons in the form area (not the mode buttons or Calculate)
    // Note: btnCalculate is NOT disabled - it stays clickable so users can see validation errors
    const fieldsToDisable = [
        'reportAirport', 'reportTime', 'depAirport', 'flightTimeInput',
        'isHVT', 'isDHD', 'customsEnd', 'isCoTerm'
    ];

    fieldsToDisable.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = disabled;
            if (disabled) {
                el.classList.add('field-disabled');
            } else {
                el.classList.remove('field-disabled');
            }
        }
    });

    // Also handle the select elements
    ['homeBase', 'repManualZone', 'depManualZone'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = disabled;
        }
    });

    // Apply overlay to form sections
    const sections = document.querySelectorAll('.group-bg');
    sections.forEach(section => {
        if (disabled) {
            section.classList.add('section-disabled');
        } else {
            section.classList.remove('section-disabled');
        }
    });
}


function resetMultiSegButtons() {
    const noBtn = document.getElementById('multiSegNo');
    const yesBtn = document.getElementById('multiSegYes');
    const container = document.getElementById('multiSegContainer');

    // Reset button styling
    [noBtn, yesBtn].forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500', 'active');
            btn.classList.add('bg-white', 'border-gray-300');
        }
    });

    // Reset container to amber (unanswered) state
    if (container) {
        container.classList.remove('border-green-500', 'bg-green-50');
        container.classList.add('border-amber-400', 'bg-amber-50');
    }

    // Hide summary section
    const summaryEl = document.getElementById('multiSegSummary');
    if (summaryEl) summaryEl.classList.add('hidden');

    // Reset answered state
    multiSegAnswered = false;
}

// Show multi-segment question only when: Intl mode AND flight time has value
function checkMultiSegVisibility() {
    const isInt = document.getElementById('modeInt').checked;
    const flightTime = document.getElementById('flightTimeInput').value;
    const multiSegCont = document.getElementById('multiSegContainer');

    if (isInt && flightTime && flightTime.trim() !== '') {
        // Show multi-segment question in Intl mode when flight time is entered
        if (multiSegCont) multiSegCont.classList.remove('hidden');
    } else {
        // Hide multi-segment question
        if (multiSegCont) multiSegCont.classList.add('hidden');
        // Reset multi-seg state when hiding
        resetMultiSegButtons();
    }
}

function answerMultiSeg(isYes) {
    const noBtn = document.getElementById('multiSegNo');
    const yesBtn = document.getElementById('multiSegYes');
    const container = document.getElementById('multiSegContainer');

    multiSegAnswered = true;

    // Remove error classes
    if (noBtn) noBtn.classList.remove('seg-missing');
    if (yesBtn) yesBtn.classList.remove('seg-missing');

    // Reset both buttons first
    [noBtn, yesBtn].forEach(btn => {
        if (btn) {
            btn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            btn.classList.add('bg-white', 'border-gray-300');
        }
    });

    // Update button states with blue highlight for selected
    if (isYes) {
        yesBtn.classList.remove('bg-white', 'border-gray-300');
        yesBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        // Open the multi-segment modal (will pre-fill from existing flight time)
        openMultiSegModal();
    } else {
        noBtn.classList.remove('bg-white', 'border-gray-300');
        noBtn.classList.add('bg-blue-500', 'text-white', 'border-blue-500');
        // Reset multi-segment values - use single flight time
        multiSegTotalMins = 0;
        multiSegSelectedMins = 0;
        // Hide the summary section
        hideMultiSegSummary();
    }

    // Update container styling to green (answered)
    if (container) {
        container.classList.remove('border-amber-400', 'bg-amber-50');
        container.classList.add('border-green-500', 'bg-green-50');
    }

    resetResult();
}

function checkCoTerminal() {
    const hb = document.getElementById('homeBase').value;
    const coTermQuestion = document.getElementById('coTermQuestion');
    const coTermSelect = document.getElementById('coTermSelect');
    const isCoTermInput = document.getElementById('isCoTerm');

    // Reset co-terminal state
    if (isCoTermInput) isCoTermInput.value = '';
    if (coTermSelect) {
        coTermSelect.classList.add('hidden');
        coTermSelect.value = '';
    }

    // Show co-terminal question if home base has co-terminals
    if (CO_TERMS[hb] && coTermQuestion) {
        coTermQuestion.classList.remove('hidden');
        // Reset styling to unanswered
        coTermQuestion.classList.remove('border-green-500', 'bg-green-50');
        coTermQuestion.classList.add('border-amber-400', 'bg-amber-50');
        // Reset buttons
        const noBtn = document.getElementById('coTerm_no');
        const yesBtn = document.getElementById('coTerm_yes');
        if (noBtn) {
            noBtn.classList.remove('bg-gray-200', 'border-gray-400');
            noBtn.classList.add('bg-white', 'border-gray-300');
        }
        if (yesBtn) {
            yesBtn.classList.remove('bg-blue-500', 'text-white', 'border-blue-500');
            yesBtn.classList.add('bg-white', 'border-gray-300');
        }
        // Populate the select dropdown
        coTermSelect.innerHTML = '<option value="">Select co-terminal...</option>';
        Object.entries(CO_TERMS[hb]).forEach(([code, mins]) => {
            const opt = document.createElement('option');
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            const dur = `${h}:${m.toString().padStart(2, '0')}`;
            opt.value = mins;
            opt.text = `${code} (Surface: ${dur})`;
            coTermSelect.appendChild(opt);
        });
    } else if (coTermQuestion) {
        coTermQuestion.classList.add('hidden');
    }
}

// Show the co-terminal splash overlay
function showCoTermSplash(homeBase) {
    const splash = document.getElementById('coTermSplash');
    const hbSpan = document.getElementById('coTermHomeBase');
    const step1 = document.getElementById('coTermStep1');
    const step2 = document.getElementById('coTermStep2');
    const splashSelect = document.getElementById('coTermSplashSelect');

    // Set home base name
    hbSpan.textContent = homeBase;

    // Reset to step 1
    step1.classList.remove('hidden');
    step2.classList.add('hidden');

    // Populate the dropdown with co-terminal options
    splashSelect.innerHTML = '<option value="0">Select Terminal...</option>';
    if (CO_TERMS[homeBase]) {
        Object.entries(CO_TERMS[homeBase]).forEach(([code, mins]) => {
            const opt = document.createElement('option');
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            const dur = `${h}:${m.toString().padStart(2, '0')}`;
            opt.value = mins;
            opt.text = `${code} (Surface: ${dur})`;
            splashSelect.appendChild(opt);
        });
    }

    // Show the splash
    splash.classList.remove('hidden');
}

// Handle Yes/No answer on co-terminal splash
function answerCoTermSplash(isYes) {
    const step1 = document.getElementById('coTermStep1');
    const step2 = document.getElementById('coTermStep2');
    const splash = document.getElementById('coTermSplash');
    const check = document.getElementById('isCoTerm');

    if (isYes) {
        // Show step 2 (terminal selection)
        step1.classList.add('hidden');
        step2.classList.remove('hidden');
    } else {
        // User said No - hide splash and uncheck the box
        splash.classList.add('hidden');
        check.checked = false;
        toggleCoTermDropdown();
    }
}

// Confirm co-terminal selection from splash
function confirmCoTermSelection() {
    const splash = document.getElementById('coTermSplash');
    const splashSelect = document.getElementById('coTermSplashSelect');
    const mainSelect = document.getElementById('coTermSelect');
    const check = document.getElementById('isCoTerm');

    if (splashSelect.value === "0") {
        alert("Please select a terminal");
        return;
    }

    // Check the box and set the main dropdown
    check.checked = true;
    toggleCoTermDropdown();

    // Sync the selection to the main dropdown
    mainSelect.value = splashSelect.value;

    // Hide splash
    splash.classList.add('hidden');
}

function toggleCoTermDropdown() {
    const isChecked = document.getElementById('isCoTerm').checked;
    const ddCont = document.getElementById('coTermDropdownContainer');
    const dd = document.getElementById('coTermSelect');
    const hb = document.getElementById('homeBase').value;
    dd.innerHTML = '<option value="0">Select Arrival Terminal...</option>';
    if (isChecked && CO_TERMS[hb]) {
        ddCont.classList.remove('hidden');
        Object.entries(CO_TERMS[hb]).forEach(([code, mins]) => {
            const opt = document.createElement('option');
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            const dur = `${h}:${m.toString().padStart(2, '0')}`;
            opt.value = mins;
            opt.text = `${code} (Surface: ${dur})`;
            dd.appendChild(opt);
        });
    } else {
        ddCont.classList.add('hidden');
    }
}

function resetResult() {
    document.getElementById('resultCard').classList.add('hidden');
    document.getElementById('errorContainer').classList.add('hidden');
    const isDom = document.getElementById('modeDom').checked;
    const prefix = isDom ? "<b class='uppercase'>DOMESTIC</b>" : "<b class='uppercase'>INTERNATIONAL</b>";
    document.getElementById('liveCalcText').innerHTML = ""; // Clear initial text to avoid "ghost message" until calc is ready

}

function resetForm() {
    // Keep dutyDate and homeBase values for successive calculations
    // Only reset the flight-specific inputs
    ['reportAirport', 'reportTime', 'depAirport', 'flightTimeInput'].forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.classList.remove('valid-airport', 'invalid-airport', 'valid-field', 'manual-city-selected');
        el.classList.add('amber-pending');
    });
    document.querySelectorAll('.toggle-checkbox').forEach(el => { el.checked = false; el.nextElementSibling.classList.remove('active'); });
    // Reset manual zone selects - clear value and reset styling, but don't hide the select itself
    ['repManualZone', 'depManualZone'].forEach(id => {
        const el = document.getElementById(id);
        el.value = '';
        el.selectedIndex = 0;  // Reset to first option (SELECT)
        el.classList.remove('manual-zone-selected');
        el.classList.add('manual-zone-select');
    });

    ['rep', 'dep'].forEach(pfx => {
        const autoCont = document.getElementById(pfx + 'ZoneAutoContainer');
        const manCont = document.getElementById(pfx + 'ManualContainer');
        const autoInput = document.getElementById(pfx + 'ZoneAuto');
        if (autoCont && manCont) {
            autoCont.classList.remove('hidden');
            manCont.classList.add('hidden');
            autoInput.value = '--';
            autoInput.className = "info-field w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300";
            // Hide nudge buttons on reset
            const nWest = document.getElementById(pfx + 'NudgeWest');
            const nEast = document.getElementById(pfx + 'NudgeEast');
            if (nWest) nWest.classList.add('invisible');
            if (nEast) nEast.classList.add('invisible');
            // Reset TZ mode label back to AUTO
            const tzLabel = document.getElementById(pfx + 'TzModeLabel');
            if (tzLabel) {
                tzLabel.textContent = '(AUTO)';
                tzLabel.className = 'text-[8px] text-gray-400';
            }
        }
    });

    // Explicitly reset the labels here
    const lblRep = document.getElementById('rtLabelCity');
    if (lblRep) { lblRep.textContent = "Local"; lblRep.className = ""; }

    // Clear mode selection (no default)
    document.getElementById('modeDom').checked = false;
    document.getElementById('modeInt').checked = false;
    document.getElementById('domCheck')?.classList.add('hidden');
    document.getElementById('intCheck')?.classList.add('hidden');

    // Re-disable form until mode is selected
    setFormDisabledState(true);

    // Show welcome splash again
    const splash = document.getElementById('welcomeSplash');
    if (splash) splash.classList.remove('hidden');

    // Hide multi-segment question
    const multiSegCont = document.getElementById('multiSegContainer');
    if (multiSegCont) multiSegCont.classList.add('hidden');
    resetMultiSegButtons();

    resetVerifyFields();
    resetModifiers();
    checkCoTerminal();
    resetResult();
}

function getZone(c) { return ALL_CODES[c] ? (ZONES[ALL_CODES[c]] || ALL_CODES[c]) : null; }

function getZoneName(iana, manId) {
    if (!iana && manId) iana = document.getElementById(manId).value;
    if (!iana) return "Loc";
    try {
        const dtStr = document.getElementById('dutyDate').value;
        const dt = dtStr ? new Date(dtStr + 'T12:00:00') : new Date();
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: iana, timeZoneName: 'short' }).formatToParts(dt);
        return parts.find(p => p.type === 'timeZoneName')?.value || "Loc";
    } catch (e) { return "Loc"; }
}

function padTimeInput(el) {
    let v = el.value.trim(); if (!v) return;
    v = v.replace(/\D/g, '');
    if (v.length > 2) { const i = v.length === 3 ? 1 : 2; v = v.slice(0, i) + ':' + v.slice(i); }
    const p = v.split(':');
    if (p.length === 2) el.value = `${p[0].padStart(2, '0')}:${p[1].padStart(2, '0')}`;
}

function formatTimeInput(el) {
    let v = el.value.replace(/\D/g, '');
    if (v.length > 4) v = v.slice(0, 4);
    if (v.length > 2) { const i = v.length === 3 ? 1 : 2; v = v.slice(0, i) + ':' + v.slice(i); }
    el.value = v;

    // Toggle amber-pending based on whether a valid time is entered
    if (v.replace(':', '').length >= 4) {
        el.classList.remove('amber-pending');
        el.classList.add('valid-field');
    } else if (v.replace(':', '').length === 0) {
        el.classList.add('amber-pending');
        el.classList.remove('valid-field');
    }
}

function nudgeZone(pfx, dir) {
    const sel = document.getElementById(pfx + 'ManualZone');
    const count = sel.options.length;
    let idx = sel.selectedIndex;
    if (idx === 0) idx = 1;
    else idx += dir;
    if (idx < 1) idx = count - 1;
    if (idx >= count) idx = 1;
    sel.selectedIndex = idx;
    // Dispatch change event instead of calling onchange directly
    sel.dispatchEvent(new Event('change'));
    resetResult();
    updateLiveCalc();
}

// Update manual timezone dropdown styling when a zone is selected
// Also updates the corresponding city field to blue when TZ is selected
function updateManualZoneStyle(el) {
    // Determine which city field corresponds to this TZ dropdown
    const cityField = el.id === 'repManualZone'
        ? document.getElementById('reportAirport')
        : document.getElementById('depAirport');

    if (el.value && el.value !== '') {
        // Selected - add class for blue 'manually completed' styling
        el.classList.remove('manual-zone-select');
        el.classList.add('manual-zone-selected');
        // Also turn the city field purple
        if (cityField) {
            cityField.classList.remove('invalid-airport', 'amber-pending');
            cityField.classList.add('manual-city-selected');
        }
    } else {
        // Not selected - use amber styling
        el.classList.remove('manual-zone-selected');
        el.classList.add('manual-zone-select');
        // City field back to amber
        if (cityField) {
            cityField.classList.remove('manual-city-selected');
            cityField.classList.add('invalid-airport');
        }
    }
}

function validateAirport(el) {
    el.value = el.value.toUpperCase();
    const code = el.value;
    const pfx = el.id === 'reportAirport' ? 'rep' : 'dep';
    const zoneAutoCont = document.getElementById(pfx + 'ZoneAutoContainer');
    const zoneManualCont = document.getElementById(pfx + 'ManualContainer');
    const zoneAuto = document.getElementById(pfx + 'ZoneAuto');
    const nudgeWest = document.getElementById(pfx + 'NudgeWest');
    const nudgeEast = document.getElementById(pfx + 'NudgeEast');

    if (!zoneAutoCont || !zoneManualCont) return;
    const isDark = document.body.classList.contains('dark-mode');
    zoneAuto.style.pointerEvents = "none";

    if (code.length === 3) {
        if (ALL_CODES[code]) {
            el.classList.add('valid-airport');
            el.classList.remove('invalid-airport', 'manual-city-selected', 'amber-pending');

            // Dynamic Label Logic
            if (el.id === 'reportAirport') {
                const lbl = document.getElementById('rtLabelCity');
                if (lbl) { lbl.textContent = code; lbl.className = "dynamic-city-label font-bold"; }
            }

            const iana = getZone(code);
            const shortZone = getZoneName(iana);
            zoneAuto.value = shortZone;
            zoneAutoCont.classList.remove('hidden');
            zoneManualCont.classList.add('hidden');
            if (nudgeWest) nudgeWest.classList.add('invisible');
            if (nudgeEast) nudgeEast.classList.add('invisible');

            if (shortZone.includes('DT') || shortZone.includes('BST') || shortZone.includes('CEST') || shortZone.includes('EEST')) {
                zoneAuto.className = isDark ? "w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300 bg-emerald-900/50 border border-emerald-700 text-emerald-200" : "w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300 bg-emerald-100 border border-emerald-300 text-emerald-800";
            } else {
                zoneAuto.className = isDark ? "w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300 bg-sky-900/50 border border-sky-700 text-sky-200" : "w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300 bg-sky-100 border border-sky-300 text-sky-800";
            }
            // Update TZ mode label to AUTO (green)
            const tzModeLabel = document.getElementById(pfx + 'TzModeLabel');
            if (tzModeLabel) {
                tzModeLabel.textContent = '(AUTO)';
                tzModeLabel.className = 'text-[8px] font-bold tz-label-auto';
            }
        } else {
            el.classList.remove('valid-airport');
            el.classList.add('invalid-airport');
            // Reset labels if invalid
            if (el.id === 'reportAirport') {
                const lbl = document.getElementById('rtLabelCity');
                if (lbl) { lbl.textContent = "Local"; lbl.className = ""; }
            }
            zoneAutoCont.classList.add('hidden');
            zoneManualCont.classList.remove('hidden');
            if (nudgeWest) nudgeWest.classList.remove('invisible');
            if (nudgeEast) nudgeEast.classList.remove('invisible');
            // Update TZ mode label to MANUAL (purple)
            const tzModeLabel = document.getElementById(pfx + 'TzModeLabel');
            if (tzModeLabel) {
                tzModeLabel.textContent = '(MANUAL)';
                tzModeLabel.className = 'text-[8px] font-bold tz-label-manual';
            }
        }
    } else {
        el.classList.remove('valid-airport', 'invalid-airport');
        // Reset labels if empty/partial
        if (el.id === 'reportAirport') {
            const lbl = document.getElementById('rtLabelCity');
            if (lbl) { lbl.textContent = "Local"; lbl.className = ""; }
        }
        zoneAuto.value = "--";
        zoneAutoCont.classList.remove('hidden');
        zoneManualCont.classList.add('hidden');
        if (nudgeWest) nudgeWest.classList.add('invisible');
        if (nudgeEast) nudgeEast.classList.add('invisible');
        zoneAuto.className = "info-field w-full px-2 rounded text-xs font-bold text-center h-8 pointer-events-none transition-colors duration-300";
        // Reset TZ mode label to AUTO for empty/partial
        const tzModeLabel = document.getElementById(pfx + 'TzModeLabel');
        if (tzModeLabel) {
            tzModeLabel.textContent = '(AUTO)';
            tzModeLabel.className = 'text-[8px] text-gray-400';
        }
    }
}

function updateAllLabels() {
    if (document.getElementById('reportAirport').value) validateAirport(document.getElementById('reportAirport'));
    if (document.getElementById('depAirport').value) validateAirport(document.getElementById('depAirport'));
}

function showInfo(k) {
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
    const modal = document.getElementById('infoModal');

    if (title && text && modal && INFO_CONTENT[k]) {
        title.textContent = INFO_CONTENT[k].title;
        text.innerHTML = INFO_CONTENT[k].text;
        modal.classList.remove('hidden');
    }
}
function closeInfo() { document.getElementById('infoModal').classList.add('hidden'); }

// --- NEW: Flight Time Warning Logic ---
let flightWarningDismissed = false;

function warnFlightTime() {
    const val = document.getElementById('flightTimeInput').value;
    const popup = document.getElementById('flightTimeWarning');
    if (!popup) return;

    if (val.length > 0 && !flightWarningDismissed) {
        popup.classList.remove('hidden');
    } else {
        popup.classList.add('hidden');
    }
}

function dismissFlightWarning() {
    const popup = document.getElementById('flightTimeWarning');
    if (popup) popup.classList.add('hidden');
    flightWarningDismissed = true;
}

// --- CORE CALCULATION LOGIC ---

function getDateInZone(dateStr, timeStr, ianaZone) {
    const cleanTime = timeStr.replace(':', '').padStart(4, '0');
    const h = cleanTime.slice(0, 2);
    const m = cleanTime.slice(2, 4);
    const inputYear = parseInt(dateStr.split('-')[0]);
    const inputMonth = parseInt(dateStr.split('-')[1]) - 1;
    const inputDay = parseInt(dateStr.split('-')[2]);
    const inputHour = parseInt(h);
    const inputMin = parseInt(m);
    let guess = Date.UTC(inputYear, inputMonth, inputDay, inputHour, inputMin);
    for (let i = 0; i < 3; i++) {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: ianaZone, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(guess);
        const getP = (t) => parseInt(parts.find(p => p.type === t).value);
        const gY = getP('year'); const gM = getP('month') - 1; const gD = getP('day'); const gH = getP('hour') === 24 ? 0 : getP('hour'); const gMin = getP('minute');
        const guessTimeInZone = Date.UTC(gY, gM, gD, gH, gMin);
        const actualTarget = Date.UTC(inputYear, inputMonth, inputDay, inputHour, inputMin);
        const diff = actualTarget - guessTimeInZone;
        if (diff === 0) break;
        guess += diff;
    }
    return guess;
}

function getDynamicZoneName(utcTime, ianaZone) {
    try {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: ianaZone, timeZoneName: 'short' }).formatToParts(new Date(utcTime));
        return parts.find(p => p.type === 'timeZoneName')?.value || "Loc";
    } catch (e) { return "Loc"; }
}



let lastCalc = {};

function calculateDuty() {
    const errCont = document.getElementById('errorContainer'), errMsg = document.getElementById('errorMsg'); errCont.classList.add('hidden');

    // --- Reset ALL Error Classes First ---
    const modeDom = document.getElementById('modeDom');
    const modeInt = document.getElementById('modeInt');
    const modeDomLabel = document.getElementById('modeDomLabel');
    const modeIntLabel = document.getElementById('modeIntLabel');
    const multiSegContainer = document.getElementById('multiSegContainer');
    const multiSegNo = document.getElementById('multiSegNo');
    const multiSegYes = document.getElementById('multiSegYes');

    // Clear mode error styling
    if (modeDomLabel) modeDomLabel.classList.remove('mode-missing');
    if (modeIntLabel) modeIntLabel.classList.remove('mode-missing');

    // Clear segment button error classes
    if (multiSegNo) multiSegNo.classList.remove('seg-missing');
    if (multiSegYes) multiSegYes.classList.remove('seg-missing');

    // Clear field error classes
    ['dutyDate', 'homeBase', 'reportAirport', 'reportTime', 'depAirport', 'flightTimeInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('input-missing');
    });

    // Clear verify button error classes
    ['dutyDateOkBtn', 'homeBaseOkBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('verify-missing');
    });

    // --- Check ALL Conditions and Collect Errors ---
    let hasError = false;
    let missingItems = [];

    // Check Field Verification (Date and Origin must be verified)
    if (!verifiedFields.dutyDate) {
        const dateBtn = document.getElementById('dutyDateOkBtn');
        if (dateBtn) dateBtn.classList.add('verify-missing');
        missingItems.push('Date Verify');
        hasError = true;
    }
    if (!verifiedFields.homeBase) {
        const baseBtn = document.getElementById('homeBaseOkBtn');
        if (baseBtn) baseBtn.classList.add('verify-missing');
        missingItems.push('Origin Verify');
        hasError = true;
    }

    // Check Mode Selection
    if (!modeDom.checked && !modeInt.checked) {
        if (modeDomLabel) modeDomLabel.classList.add('mode-missing');
        if (modeIntLabel) modeIntLabel.classList.add('mode-missing');
        missingItems.push('Mode');
        hasError = true;
    }

    // Check Segment Selection (International only)
    if (modeInt.checked && multiSegContainer && !multiSegContainer.classList.contains('hidden')) {
        const singleSelected = multiSegNo?.classList.contains('active');
        const multiSelected = multiSegYes?.classList.contains('active');

        if (!singleSelected && !multiSelected) {
            if (multiSegNo) multiSegNo.classList.add('seg-missing');
            if (multiSegYes) multiSegYes.classList.add('seg-missing');
            missingItems.push('Segment');
            hasError = true;
        }
    }

    // Check Required Fields
    const req = [{ id: 'dutyDate', n: 'Duty Date' }, { id: 'homeBase', n: 'Home Base' }, { id: 'reportAirport', n: 'Report City' }, { id: 'reportTime', n: 'Report Time' }, { id: 'depAirport', n: 'Dep City' }, { id: 'flightTimeInput', n: 'Flight Time' }];

    for (let r of req) {
        const el = document.getElementById(r.id);
        if (!el.value) {
            el.classList.add('input-missing');
            missingItems.push(r.n);
            hasError = true;
        }
    }

    // Check Modifier Questions - all visible modifiers must be answered
    const modifiers = [
        { id: 'isHVT', name: 'HVT Question', questionId: 'hvtQuestion' },
        { id: 'isDHD', name: 'DHD Question', questionId: 'dhdQuestion' },
        { id: 'customsEnd', name: 'Customs Question', questionId: 'customsQuestion' }
    ];

    for (let mod of modifiers) {
        const question = document.getElementById(mod.questionId);
        const hidden = document.getElementById(mod.id);
        // Check if question is visible, not disabled (opacity), and not answered
        const isHiddenOrDisabled = question.classList.contains('hidden') || question.style.opacity === '0.5';
        if (question && !isHiddenOrDisabled && hidden && hidden.value === '') {
            question.classList.add('modifier-missing');
            missingItems.push(mod.name);
            hasError = true;
        }
    }

    // Check Co-Terminal question if visible
    const coTermQuestion = document.getElementById('coTermQuestion');
    const isCoTermInput = document.getElementById('isCoTerm');
    const coTermSelect = document.getElementById('coTermSelect');
    if (coTermQuestion && !coTermQuestion.classList.contains('hidden')) {
        // Check if question not answered, or Yes was clicked but no city selected
        const yesClickedButNoSelection = coTermSelect && !coTermSelect.classList.contains('hidden') && !coTermSelect.value;
        if (isCoTermInput && (isCoTermInput.value === '' || yesClickedButNoSelection)) {
            coTermQuestion.classList.add('modifier-missing');
            missingItems.push(yesClickedButNoSelection ? 'Co-Terminal Selection' : 'Co-Terminal Question');
            hasError = true;
        }
    }

    if (hasError) {
        errMsg.textContent = `Missing: ${missingItems[0]}${missingItems.length > 1 ? ` (+${missingItems.length - 1} more)` : ''}`;
        errCont.classList.remove('hidden');
        return;
    }

    // ... rest of logic

    const hb = document.getElementById('homeBase').value;
    const rTimeStr = document.getElementById('reportTime').value;
    let rAir = document.getElementById('reportAirport').value.toUpperCase();
    let dAir = document.getElementById('depAirport').value.toUpperCase();
    const dateStr = document.getElementById('dutyDate').value;
    const isDom = document.getElementById('modeDom').checked;

    if (rAir !== 'ZZZ') {
        if (!ALL_CODES[rAir] && document.getElementById('repManualZone').value === "") { errMsg.textContent = "Invalid Report City: Select Zone"; errCont.classList.remove('hidden'); return; }
    }
    if (!ALL_CODES[dAir] && document.getElementById('depManualZone').value === "") { errMsg.textContent = "Invalid Dep City: Select Zone"; errCont.classList.remove('hidden'); return; }

    let rZone;
    if (rAir === 'ZZZ') { rZone = getZone('DEN'); } else { rZone = ALL_CODES[rAir] ? getZone(rAir) : document.getElementById('repManualZone').value; }
    const dZone = ALL_CODES[dAir] ? getZone(dAir) : document.getElementById('depManualZone').value;
    const hZone = getZone(hb);

    const reportUTC = getDateInZone(dateStr, rTimeStr, rZone);
    const rZnStr = getDynamicZoneName(reportUTC, rZone);
    const hdtParts = new Intl.DateTimeFormat('en-US', { timeZone: hZone, hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(reportUTC);
    const hH = parseInt(hdtParts.find(p => p.type === 'hour').value) % 24; const hM = parseInt(hdtParts.find(p => p.type === 'minute').value);
    const hdtMins = hH * 60 + hM;
    const hZnStr = getDynamicZoneName(reportUTC, hZone);

    const fStr = document.getElementById('flightTimeInput').value.replace(':', '').padStart(4, '0'); const fH = parseInt(fStr.slice(0, 2)) || 0, fM = parseInt(fStr.slice(2, 4)) || 0;
    const schedFlightMins = fH * 60 + fM;
    let maxDutyMins = 0; let expl = ""; const fmt = (m) => { let h = Math.floor(m / 60), mn = m % 60; return `${h.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}`; }

    if (isDom) {
        const isHVT = document.getElementById('isHVT').value === 'true'; const isDay = hdtMins >= 300 && hdtMins <= 1139; let limit = 13;
        expl = `13hrs (Report ${fmt(hdtMins)} HDT, 1900-0459)`;
        if (isHVT) {
            limit = 16;
            expl = `16hrs (HVT)`;
        } else {
            if (isDay) { limit = 15; expl = `15hrs (Report ${fmt(hdtMins)} HDT, 0500-1859)`; }
        }
        maxDutyMins = limit * 60;
    } else {
        // International mode - check if multi-segment is active (Yes button has 'active' class)
        const yesBtn = document.getElementById('multiSegYes');
        const isMultiSeg = yesBtn?.classList.contains('active') && multiSegTotalMins > 0;
        const effectiveFlightMins = isMultiSeg ? multiSegTotalMins : schedFlightMins;

        if (effectiveFlightMins <= 480) { maxDutyMins = 16 * 60; expl = "16:00 (Int'l, Flt ≤ 8:00)"; }
        else if (effectiveFlightMins <= 720) { maxDutyMins = 16 * 60 + 30; expl = "16:30 (Int'l, Flt 8:01-12:00)"; }
        else {
            // >12:00 variable formula - only widebody, so check home vs layover
            const reportCity = document.getElementById('reportAirport').value.toUpperCase().trim();
            const pairingOrigin = document.getElementById('homeBase').value.toUpperCase().trim();
            const isLayover = reportCity !== pairingOrigin;
            const checkIn = isLayover ? 60 : 75; // Layover: 1:00, Home Base: 1:15
            const buffer = 210; // 3:30
            maxDutyMins = checkIn + effectiveFlightMins + buffer;
            const debrief = document.getElementById('isDHD').value === 'true' ? 0 : 15;
            let cust = document.getElementById('customsEnd').value === 'true' ? 15 : 0;
            maxDutyMins += (debrief + cust);
            const checkInLabel = isLayover ? '1:00 Layover' : '1:15 Home';
            expl = `Variable (${checkInLabel} + Flt + Cust + Debr + 3:30)`;
        }

        // If multi-segment, add note about cumulative time
        if (isMultiSeg) {
            const totalH = Math.floor(multiSegTotalMins / 60);
            const totalM = multiSegTotalMins % 60;
            expl += ` [Total: ${totalH}:${totalM.toString().padStart(2, '0')}]`;
        }
    }

    const debrief = document.getElementById('isDHD').value === 'true' ? 0 : 15;
    let cust = document.getElementById('customsEnd').value === 'true' ? 15 : 0;
    let coTermDed = 0; const isCoTerm = document.getElementById('isCoTerm').value !== ''; if (isCoTerm && !document.getElementById('coTermQuestion').classList.contains('hidden')) { coTermDed = parseInt(document.getElementById('coTermSelect').value) || 0; }
    const flightMs = schedFlightMins * 60000;
    const deductionsMs = (debrief + cust + coTermDed) * 60000;
    const maxDutyMs = maxDutyMins * 60000;
    const hardStopUTC = reportUTC + maxDutyMs;
    const doorCloseUTC = hardStopUTC - deductionsMs - flightMs;

    const timeInZone = (utc, z) => { const f = new Intl.DateTimeFormat('en-US', { timeZone: z, hour: 'numeric', minute: 'numeric', hour12: false }); const p = f.formatToParts(utc); const h = p.find(x => x.type === 'hour').value.padStart(2, '0'); const m = p.find(x => x.type === 'minute').value.padStart(2, '0'); return `${h}:${m}`; };

    const dZnStr = getDynamicZoneName(doorCloseUTC, dZone);
    const stopZnStr = getDynamicZoneName(hardStopUTC, dZone);
    const repInDepZn = getDynamicZoneName(reportUTC, dZone);
    const doorCloseStr = timeInZone(doorCloseUTC, dZone);

    document.getElementById('resultTime').textContent = doorCloseStr;
    document.getElementById('resultZone').textContent = `${dAir} Time (${dZnStr})`;

    document.getElementById('calcStepReportLocal').textContent = `${rTimeStr.replace(/(\d{2})(\d{2})/, '$1:$2')} ${rAir} (${rZnStr})`;
    document.getElementById('calcStepReportHDT').textContent = `${timeInZone(reportUTC, hZone)} ${hb} (${hZnStr})`;

    const repInDep = timeInZone(reportUTC, dZone);
    document.getElementById('calcStepReportDep').textContent = `${repInDep} ${dAir} (${repInDepZn})`;
    document.getElementById('calcStepMax').textContent = `+${fmt(maxDutyMins)}`;
    document.getElementById('calcStepMaxExplanation').textContent = expl;

    const stopLabel = document.getElementById('calcStepStopLabel');
    if (repInDepZn !== stopZnStr) {
        stopLabel.textContent = "= Duty Hard Stop (DST Adj.)";
    } else {
        stopLabel.textContent = "= Duty Hard Stop";
    }
    document.getElementById('calcStepStop').textContent = `${timeInZone(hardStopUTC, dZone)} ${dAir} (${stopZnStr})`;

    const rowCT = document.getElementById('rowCoTermLabel');
    const rowCTVal = document.getElementById('valCoTerm');
    if (coTermDed > 0) { rowCT.classList.remove('hidden'); rowCTVal.classList.remove('hidden'); rowCTVal.textContent = `-${coTermDed}`; } else { rowCT.classList.add('hidden'); rowCTVal.classList.add('hidden'); }

    document.getElementById('calcStepDebriefLabel').textContent = debrief === 0 ? "- Debrief (DHD)" : "- Debrief"; document.getElementById('calcStepDebriefVal').textContent = `-${debrief}`;

    const crL = document.getElementById('calcStepCustomsRowLabel');
    const crV = document.getElementById('calcStepCustoms');
    if (cust > 0) { crL.classList.remove('hidden'); crV.classList.remove('hidden'); crV.textContent = `-${cust}`; } else { crL.classList.add('hidden'); crV.classList.add('hidden'); }

    document.getElementById('calcStepFlight').textContent = `-${fH}:${fM.toString().padStart(2, '0')}`;
    document.getElementById('calcStepResult').textContent = `${doorCloseStr} ${dAir} (${dZnStr})`;

    const rc = document.getElementById('resultCard'); rc.classList.remove('hidden'); rc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    lastCalc = {
        rTime: rTimeStr.replace(/(\d{2})(\d{2})/, '$1:$2'),
        rAir: rAir, hdt: `${fmt(hdtMins)}`, hb: hb,
        flt: `${fH}:${fM.toString().padStart(2, '0')}`,
        max: expl, hardStop: `${timeInZone(hardStopUTC, dZone)} ${dAir}`,
        deducts: [],
        final: `${doorCloseStr} ${dAir}`
    };
    if (debrief > 0) lastCalc.deducts.push(`Debrief ${debrief}m`);
    if (cust > 0) lastCalc.deducts.push(`Customs ${cust}m`);
    if (coTermDed > 0) lastCalc.deducts.push(`Co-Term Travel ${coTermDed}m`);
    if (lastCalc.deducts.length === 0) lastCalc.deducts.push("None");
}

// --- NEW: Live Calc Wrapper ---
function updateLiveCalc() {
    // Auto-calculate disabled - user wants button-only calculation
    // Just reset the result display when inputs change
    resetResult();
}


// --- INIT ---

// --- MULTI-SEGMENT MODAL LOGIC ---

function toggleMultiSegment() {
    const isChecked = document.getElementById('isMultiSeg').checked;
    if (isChecked) {
        openMultiSegModal();
    } else {
        multiSegTotalMins = 0;
        multiSegSelectedMins = 0;
        // Clear the main flight time input if it was set by multi-seg
        resetResult();
    }
}

function openMultiSegModal() {
    const modal = document.getElementById('multiSegModal');
    const flightInput = document.getElementById('flightTimeInput');
    const directSection = document.getElementById('directTotalSection');
    const calcSection = document.getElementById('calcSection');

    if (modal) {
        // Display "This Segment" from main flight time field (always update this)
        const thisSegDisplay = document.getElementById('thisSegmentDisplay');
        if (thisSegDisplay && flightInput && flightInput.value) {
            thisSegDisplay.textContent = flightInput.value;
        } else if (thisSegDisplay) {
            thisSegDisplay.textContent = '--:--';
        }

        // DON'T clear inputs - retain values for editing
        // Just ensure section states are correct based on current content
        const directInput = document.getElementById('directTotalInput');
        const hasDirectInput = directInput && directInput.value && directInput.value.trim() !== '';

        let hasSegmentInput = false;
        ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp && inp.value && inp.value.trim() !== '') {
                hasSegmentInput = true;
            }
        });

        // Set section states based on existing content
        if (hasDirectInput) {
            calcSection.style.opacity = '0.4';
            calcSection.style.pointerEvents = 'none';
            directSection.style.opacity = '1';
            directSection.style.pointerEvents = 'auto';
        } else if (hasSegmentInput) {
            directSection.style.opacity = '0.4';
            directSection.style.pointerEvents = 'none';
            calcSection.style.opacity = '1';
            calcSection.style.pointerEvents = 'auto';
        } else {
            // Both empty - enable both
            directSection.style.opacity = '1';
            directSection.style.pointerEvents = 'auto';
            calcSection.style.opacity = '1';
            calcSection.style.pointerEvents = 'auto';
        }

        // Update calculator display
        updateCalcTotal();

        modal.classList.remove('hidden');
    }
}

function closeMultiSegModal() {
    const modal = document.getElementById('multiSegModal');
    if (modal) modal.classList.add('hidden');
    // If no total was set, reset the Yes button state
    if (multiSegTotalMins === 0) {
        const yesBtn = document.getElementById('multiSegYes');
        const noBtn = document.getElementById('multiSegNo');
        if (yesBtn) yesBtn.classList.remove('active');
        // Don't auto-select No, let user decide
    }
}

function addMoreSegment() {
    const rowC = document.getElementById('addSegCRow');
    const rowD = document.getElementById('addSegDRow');
    const btn = document.getElementById('addMoreSegBtn');

    if (rowC?.classList.contains('hidden')) {
        rowC.classList.remove('hidden');
    } else if (rowD?.classList.contains('hidden')) {
        rowD.classList.remove('hidden');
        btn?.classList.add('hidden'); // Hide button after max segments
    }
}

function parseTimeToMins(str) {
    if (!str) return 0;
    const clean = str.replace(':', '').padStart(4, '0');
    const h = parseInt(clean.slice(0, 2)) || 0;
    const m = parseInt(clean.slice(2, 4)) || 0;
    return h * 60 + m;
}

function formatMinsToTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}:${m.toString().padStart(2, '0')}`;
}

function getLimitMessage(totalMins) {
    if (totalMins === 0) {
        return { text: 'Enter segment times', className: 'text-[10px] text-gray-500 mt-1 text-center italic' };
    } else if (totalMins <= 480) {
        return { text: '→ 16:00 max duty limit applies', className: 'text-[10px] text-blue-600 mt-1 text-center font-bold' };
    } else if (totalMins <= 720) {
        return { text: '→ 16:30 max duty limit applies', className: 'text-[10px] text-green-600 mt-1 text-center font-bold' };
    } else {
        return { text: '→ Variable formula applies (>12:00)', className: 'text-[10px] text-orange-600 mt-1 text-center font-bold' };
    }
}

function updateDirectTotal() {
    // Just format the input - no live display needed for direct entry
}

function updateCalcTotal() {
    const flightInput = document.getElementById('flightTimeInput');
    const thisSegMins = flightInput ? parseTimeToMins(flightInput.value) : 0;

    let additionalMins = 0;
    ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp && inp.value) {
            additionalMins += parseTimeToMins(inp.value);
        }
    });

    const total = thisSegMins + additionalMins;

    document.getElementById('calcTotalDisplay').textContent = formatMinsToTime(total);

    const msgEl = document.getElementById('calcLimitMsg');
    if (msgEl) {
        const limitInfo = getLimitMessage(total);
        msgEl.textContent = limitInfo.text;
        msgEl.className = limitInfo.className;
    }
}

// Handle mutual exclusion between direct total and calculator sections
function handleMultiSegInput(source) {
    const directSection = document.getElementById('directTotalSection');
    const calcSection = document.getElementById('calcSection');
    const directInput = document.getElementById('directTotalInput');
    const applyBtn = document.getElementById('applyTotalBtn');

    // Check if any segment inputs have values
    let hasSegmentInput = false;
    ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp && inp.value && inp.value.trim() !== '') {
            hasSegmentInput = true;
        }
    });

    const hasDirectInput = directInput && directInput.value && directInput.value.trim() !== '';

    if (source === 'direct' && hasDirectInput) {
        // User is typing in direct total - disable calc section
        calcSection.style.opacity = '0.4';
        calcSection.style.pointerEvents = 'none';
        directSection.style.opacity = '1';
        directSection.style.pointerEvents = 'auto';
        if (applyBtn) applyBtn.textContent = 'Apply Total';
    } else if (source === 'calc' && hasSegmentInput) {
        // User is typing in calculator - disable direct section
        directSection.style.opacity = '0.4';
        directSection.style.pointerEvents = 'none';
        calcSection.style.opacity = '1';
        calcSection.style.pointerEvents = 'auto';
        if (applyBtn) applyBtn.textContent = 'Apply Calculated Total';
    } else if (!hasDirectInput && !hasSegmentInput) {
        // Both are empty - enable both
        directSection.style.opacity = '1';
        directSection.style.pointerEvents = 'auto';
        calcSection.style.opacity = '1';
        calcSection.style.pointerEvents = 'auto';
        if (applyBtn) applyBtn.textContent = 'Apply Total';
    }

    // Also update the calculated total display
    updateCalcTotal();
}

// Clear all fields in the mini calc
function clearMultiSegFields() {
    const directInput = document.getElementById('directTotalInput');
    const directSection = document.getElementById('directTotalSection');
    const calcSection = document.getElementById('calcSection');
    const applyBtn = document.getElementById('applyTotalBtn');

    // Clear direct total
    if (directInput) directInput.value = '';

    // Clear all segment inputs
    ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp) inp.value = '';
    });

    // Reset section states
    directSection.style.opacity = '1';
    directSection.style.pointerEvents = 'auto';
    calcSection.style.opacity = '1';
    calcSection.style.pointerEvents = 'auto';
    if (applyBtn) applyBtn.textContent = 'Apply Total';

    // Update display
    updateCalcTotal();
}

// Unified apply function for the single Apply button
function applyMultiSegTotal() {
    const flightInput = document.getElementById('flightTimeInput');
    const directInput = document.getElementById('directTotalInput');
    const thisSegMins = flightInput ? parseTimeToMins(flightInput.value) : 0;

    let additionalMins = 0;
    ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
        const inp = document.getElementById(id);
        if (inp && inp.value) {
            additionalMins += parseTimeToMins(inp.value);
        }
    });

    const directTotalMins = directInput ? parseTimeToMins(directInput.value) : 0;

    // Require either: direct total entered OR at least one additional segment
    if (directTotalMins === 0 && additionalMins === 0) {
        alert('Max says: Please enter a total flight time or at least one additional segment! ✈️');
        return;
    }

    // If direct total was entered, use that; otherwise use calculated total
    if (directTotalMins > 0) {
        multiSegTotalMins = directTotalMins;
        // Show summary for direct entry
        updateMultiSegSummary(directTotalMins, null);
    } else {
        multiSegTotalMins = thisSegMins + additionalMins;
        // Show summary with breakdown
        const segments = [];
        segments.push({ label: 'Door Close Seg', mins: thisSegMins });
        ['addSegA', 'addSegB', 'addSegC', 'addSegD'].forEach(id => {
            const inp = document.getElementById(id);
            if (inp && inp.value) {
                segments.push({ label: '+ Add Seg', mins: parseTimeToMins(inp.value) });
            }
        });
        updateMultiSegSummary(multiSegTotalMins, segments);
    }
    closeMultiSegModal();
    resetResult();
}

// Update and show the multi-segment summary section
function updateMultiSegSummary(totalMins, segments) {
    const summaryEl = document.getElementById('multiSegSummary');
    const breakdownEl = document.getElementById('multiSegBreakdown');
    const totalSummaryEl = document.getElementById('multiSegTotalSummary');
    const dutyMaxEl = document.getElementById('multiSegDutyMax');

    if (!summaryEl) return;

    // Build breakdown HTML
    let breakdownHtml = '';
    if (segments && segments.length > 0) {
        segments.forEach((seg, i) => {
            const prefix = i === 0 ? '' : '';
            breakdownHtml += `<div class="flex justify-between"><span>${seg.label}:</span><span>${formatMinsToTime(seg.mins)}</span></div>`;
        });
    } else {
        // Direct entry - just show the total
        breakdownHtml = `<div class="text-center italic text-gray-500">Direct total entered</div>`;
    }
    breakdownEl.innerHTML = breakdownHtml;

    // Update total
    totalSummaryEl.textContent = formatMinsToTime(totalMins);

    // Determine and show applicable duty max
    const totalHours = totalMins / 60;
    let dutyMaxText = '';
    if (totalHours >= 8) {
        dutyMaxText = 'Duty Max: 16:30 (Sched FTM ≥ 8:00)';
    } else {
        dutyMaxText = 'Duty Max: 16:00 (Sched FTM < 8:00)';
    }
    dutyMaxEl.textContent = dutyMaxText;

    // Show the summary section
    summaryEl.classList.remove('hidden');
}

// Hide the multi-segment summary
function hideMultiSegSummary() {
    const summaryEl = document.getElementById('multiSegSummary');
    if (summaryEl) summaryEl.classList.add('hidden');
}

// Legacy function name mappings for compatibility
function applyDirectTotal() { applyMultiSegTotal(); }
function applyCalcTotal() { applyMultiSegTotal(); }
function updateMultiSegTotal() { updateCalcTotal(); }
function applyMultiSegment() { applyMultiSegTotal(); }
function addSegmentRow() { addMoreSegment(); }

function checkTestTrigger() {
    const city = document.getElementById('reportAirport').value.toUpperCase();
    validateAirport(document.getElementById('reportAirport'));
}

function init() {
    const d = new Date();
    const denverDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    document.getElementById('dutyDate').value = denverDate;
    const bs = document.getElementById('homeBase');
    bs.innerHTML = '';
    BASES.sort((a, b) => a.c.localeCompare(b.c)).forEach(b => { const o = document.createElement('option'); o.value = b.c; o.text = `${b.c} Pairing`; if (b.c === 'DEN') o.selected = true; bs.appendChild(o); });
    const dl = document.getElementById('airportList');
    dl.innerHTML = '';
    Object.keys(ALL_CODES).sort().forEach(c => { const o = document.createElement('option'); o.value = c; dl.appendChild(o); });

    const pZ = (id) => {
        const s = document.getElementById(id);
        s.innerHTML = '<option value="" disabled selected>SELECT</option>';
        Object.keys(MANUAL_ZONES).forEach(group => {
            const grp = document.createElement('optgroup');
            grp.label = group;
            MANUAL_ZONES[group].forEach(z => {
                const o = document.createElement('option');
                o.value = z.val;
                o.text = z.name;
                o.dataset.short = z.short;
                grp.appendChild(o);
            });
            s.appendChild(grp);
        });
    };
    pZ('repManualZone'); pZ('depManualZone');

    document.querySelectorAll('.toggle-checkbox').forEach(chk => {
        chk.addEventListener('change', function () {
            const pillDiv = this.nextElementSibling;
            if (this.checked) {
                pillDiv.classList.add('active');
            } else {
                pillDiv.classList.remove('active');
            }
            resetResult();
            resetResult();
        });
    });

    checkCoTerminal();

    // Initially disable form until mode is selected
    setFormDisabledState(true);

    document.getElementById('reportAirport').addEventListener('input', checkTestTrigger);
    // Add flight warning listener
    const fltInput = document.getElementById('flightTimeInput');
    if (fltInput) {
        fltInput.addEventListener('input', warnFlightTime);
        // Click-away listener for popup
        document.addEventListener('click', function (e) {
            const p = document.getElementById('flightTimeWarning');
            const fltInput = document.getElementById('flightTimeInput');
            // Check if popup is visible and click is OUTSIDE the popup and OUTSIDE the input
            if (p && !p.classList.contains('hidden') && !p.contains(e.target) && e.target !== fltInput) {
                dismissFlightWarning();
            }
        });
    }

    const copyBtn = document.getElementById('btnCopyReceipt');
    if (copyBtn) { copyBtn.addEventListener('click', copyReceipt); }
    const calcBtn = document.getElementById('btnCalculate');
    if (calcBtn) { calcBtn.addEventListener('click', calculateDuty); }

    // --- NEW: Add listeners to clear errors ---
    ['dutyDate', 'homeBase', 'reportAirport', 'reportTime', 'depAirport', 'flightTimeInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', function () {
                this.classList.remove('input-missing');
            });
            // For select elements, input might not trigger
            el.addEventListener('change', function () {
                this.classList.remove('input-missing');
            });
        }
    });

    window.nudgeZone = nudgeZone;
    window.nudgeZone = nudgeZone;
    window.calculateDuty = calculateDuty;
    window.resetForm = resetForm;
    window.toggleMode = toggleMode;
    window.toggleDarkMode = toggleDarkMode;
    window.checkCoTerminal = checkCoTerminal;
    window.toggleCoTermDropdown = toggleCoTermDropdown;
    window.validateAirport = validateAirport;
    window.formatTimeInput = formatTimeInput;
    window.padTimeInput = padTimeInput;
    window.copyReceipt = copyReceipt;
    window.showInfo = showInfo;
    window.closeInfo = closeInfo;
    window.updateAllLabels = updateAllLabels;
    window.dismissFlightWarning = dismissFlightWarning;

    // Multi-segment exports
    window.toggleMultiSegment = toggleMultiSegment;
    window.openMultiSegModal = openMultiSegModal;
    window.closeMultiSegModal = closeMultiSegModal;
    window.addSegmentRow = addSegmentRow;
    window.addMoreSegment = addMoreSegment;
    window.updateMultiSegTotal = updateMultiSegTotal;
    window.updateCalcTotal = updateCalcTotal;
    window.updateDirectTotal = updateDirectTotal;
    window.applyMultiSegment = applyMultiSegment;
    window.applyDirectTotal = applyDirectTotal;
    window.applyCalcTotal = applyCalcTotal;
    window.applyMultiSegTotal = applyMultiSegTotal;
    window.handleMultiSegInput = handleMultiSegInput;
    window.clearMultiSegFields = clearMultiSegFields;
    window.answerMultiSeg = answerMultiSeg;
    window.resetMultiSegButtons = resetMultiSegButtons;
    window.checkMultiSegVisibility = checkMultiSegVisibility;
    window.setFormDisabledState = setFormDisabledState;
    window.selectModeFromSplash = selectModeFromSplash;
    window.answerCoTermSplash = answerCoTermSplash;
    window.confirmCoTermSelection = confirmCoTermSelection;
    window.verifyField = verifyField;
    window.answerModifier = answerModifier;
    window.answerCoTermModifier = answerCoTermModifier;
    window.selectCoTerminal = selectCoTerminal;
    window.resetModifiers = resetModifiers;
}

// Handle mode selection from welcome splash
function selectModeFromSplash(mode) {
    const splash = document.getElementById('welcomeSplash');
    if (splash) splash.classList.add('hidden');

    if (mode === 'dom') {
        document.getElementById('modeDom').click();
    } else {
        document.getElementById('modeInt').click();
    }
}

window.addEventListener('DOMContentLoaded', init);

