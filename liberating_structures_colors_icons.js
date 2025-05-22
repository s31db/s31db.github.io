const iconNames = [
  '1-2-4-all.svg',
  '15-percent-solutions.svg',
  '25-10-crowdsourcing.svg',
  '9-whys.svg',
  'agree-certainty-matrix.svg',
  'appreciative-interviews.svg',
  'celebrity-interview.svg',
  'conversation-cafe.svg',
  'critical-uncertainties.svg',
  'design-elements.svg',
  'design-storyboards-transparent.svg',
  'design-storyboards.svg',
  'discovery-and-action-dialog.svg',
  'drawing-together.svg',
  'ecocycle.svg',
  'generative-relationships.svg',
  'heard-seen-respected.svg',
  'helping-heuristics.svg',
  'impromptu-networking.svg',
  'improv-prototyping.svg',
  'integrated-autonomy.svg',
  'ls-menu.svg',
  'min-specs.svg',
  'open-space.svg',
  'panarchy.svg',
  'purpose-to-practice.svg',
  'shift-and-share.svg',
  'simple-ethnography.svg',
  'social-network-webbing.svg',
  'triz.svg',
  'troika-consulting.svg',
  'user-experience-fishbowl.svg',
  'what-3-debrief.svg',
  'what-i-need-from-you.svg',
  'wicked-questions.svg',
  'wise-crowds.svg'
];

let svgCache = {};

function renderChecklist(filteredNames = iconNames) {
  const checklistContainer = document.getElementById('iconChecklist');
  checklistContainer.innerHTML = '';
  filteredNames.forEach(name => {
    const label = document.createElement('label');
    label.className = 'icon-item';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    checkbox.classList.add('icon-checkbox');
    label.appendChild(checkbox);
    label.append(name.replace('.svg', ''));
    checklistContainer.appendChild(label);

    checkbox.addEventListener('change', updatePreview);
  });
}

// Fonction de chargement et remplacement couleur
async function fetchAndColorSVG(name, color) {
  if (!svgCache[name]) {
    const url = `https://raw.githubusercontent.com/s31db/liberating-structures-color-icons/master/icons/${name}`;
    const res = await fetch(url);
    svgCache[name] = await res.text();
  }
  return svgCache[name].replace(/#000000/gi, color);
}

async function updatePreview() {
  const previewContainer = document.getElementById('preview');
  const selected = getSelectedIconNames();
  const color = colorPicker.value;
  previewContainer.innerHTML = '';

  for (const name of selected) {
    const svg = await fetchAndColorSVG(name, color);
    const div = document.createElement('div');
    div.className = 'icon-preview';
    div.innerHTML = svg;
    previewContainer.appendChild(div);
  }
}

// Outil : noms des icônes cochées
function getSelectedIconNames() {
  return Array.from(document.querySelectorAll('.icon-checkbox'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
}

function prepareColorPicker() {

    const checklistContainer = document.getElementById('iconChecklist');
    const selectAllCheckbox = document.getElementById('selectAll');

    // Générer les cases à cocher
    iconNames.forEach(name => {
      const label = document.createElement('label');
      label.className = 'icon-item';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = name;
      checkbox.classList.add('icon-checkbox');

      label.appendChild(checkbox);
      label.append(name.replace('.svg', ''));
      checklistContainer.appendChild(label);
    });

    // Gérer le "Tout sélectionner"
    selectAllCheckbox.addEventListener('change', () => {
      document.querySelectorAll('.icon-checkbox').forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
      });
      updatePreview();
    });

    // Télécharger les SVG sélectionnés
    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', async () => {
      const selected = getSelectedIconNames();
      const color = colorPicker.value;
      const zip = new JSZip();

      for (const name of selected) {
        const svg = await fetchAndColorSVG(name, color);
        zip.file(name, svg);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'icons-colored.zip';
      link.click();
    });

    // Écouteurs
    colorPicker.addEventListener('input', updatePreview);
    document.querySelectorAll('.icon-checkbox').forEach(cb =>
      cb.addEventListener('change', updatePreview)
    );
    // 🔍 Recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = iconNames.filter(name =>
        name.toLowerCase().includes(query)
      );
      renderChecklist(filtered);
      updatePreview();
    });

    // Chargement initial
    renderChecklist();
    updatePreview();

    // Sauvegarde
    const STORAGE_KEY = "ls-icon-tool";

    function saveState() {
      const state = {
        color: colorPicker.value,
        selectedIcons: getSelectedIconNames(),
        search: searchInput.value
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return;

      colorPicker.value = saved.color || "#000000";
      searchInput.value = saved.search || "";

      renderChecklist(iconNames.filter(name =>
        name.toLowerCase().includes(saved.search?.toLowerCase() || "")
      ));

      const checkboxes = document.querySelectorAll('.icon-checkbox');
      checkboxes.forEach(cb => {
        cb.checked = saved.selectedIcons?.includes(cb.value);
      });

      updatePreview();
    }

    // Ajoute les appels de sauvegarde
    colorPicker.addEventListener('input', () => {
      updatePreview();
      saveState();
    });

    selectAllCheckbox.addEventListener('change', () => {
      document.querySelectorAll('.icon-checkbox').forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
      });
      updatePreview();
      saveState();
    });

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = iconNames.filter(name =>
        name.toLowerCase().includes(query)
      );
      renderChecklist(filtered);
      updatePreview();
      saveState();
    });

    loadState();

    const INFO_KEY = "infoBoxOpen";
    const infoBox = document.getElementById("infoBox");

    // Charger l'état
    const savedInfoState = localStorage.getItem(INFO_KEY);
    if (savedInfoState === null) {
      infoBox.open = true; // premier chargement → ouvert par défaut
    } else {
      infoBox.open = savedInfoState === "true";
    }

    // Sauvegarder l'état à chaque changement
    infoBox.addEventListener("toggle", () => {
      localStorage.setItem(INFO_KEY, infoBox.open);
    });

}

window.addEventListener('load', () => {prepareColorPicker();});
