const fs = require('fs');

const content = fs.readFileSync('Geopolitical_Zones_of_Nigeria.svg', 'utf8');

// The 6 zones and their fill colors in Geopolitical_Zones_of_Nigeria.svg:
// #bc5fd3 -> North West (7 states)
// #008000 -> North East (6 states)
// #ff7f2a -> North Central (6 states + FCT = 7)
// #d40000 -> South West (6 states)
// #d4aa00 -> South East (5 states)
// #0055d4 -> South South (6 states + coastal)
// #b3b3b3 -> FCT or border enclave

const zoneColorMap = {
  '#bc5fd3': 'North West',
  '#008000': 'North East',
  '#ff7f2a': 'North Central',
  '#d40000': 'South West',
  '#d4aa00': 'South East',
  '#0055d4': 'South South',
  '#b3b3b3': 'North Central' // FCT
};

// Extract layercountry paths
const layerCountryStart = content.indexOf('id="layercountry"');
const layerBoundariesStart = content.indexOf('id="layerrBoundaries"');
const countryBlock = content.substring(layerCountryStart, layerBoundariesStart);

const pathsByZone = {
  'North West': [],
  'North East': [],
  'North Central': [],
  'South West': [],
  'South East': [],
  'South South': []
};

const pathBlocks = countryBlock.split('<path').slice(1);
pathBlocks.forEach(pb => {
  const end = pb.indexOf('/>');
  const full = pb.substring(0, end);
  const idMatch = full.match(/\sid="([^"]+)"/);
  const styleMatch = full.match(/\sstyle="([^"]+)"/);
  const dMatch = full.match(/\sd="([\s\S]*?)"/);
  if (idMatch && styleMatch && dMatch) {
    const id = idMatch[1];
    const style = styleMatch[1];
    const d = dMatch[1].replace(/\r?\n/g, ' ').trim();
    const fillMatch = style.match(/fill:\s*(#[0-9a-fA-F]{6}|[a-zA-Z]+)/);
    const fill = fillMatch ? fillMatch[1].toLowerCase() : 'none';
    const zone = zoneColorMap[fill];
    if (zone && pathsByZone[zone]) {
      pathsByZone[zone].push({ id, d, fill });
    }
  }
});

// Also extract boundary lines from layerrBoundaries
const boundariesEnd = content.indexOf('</svg>', layerBoundariesStart);
const boundariesBlock = content.substring(layerBoundariesStart, boundariesEnd);
const boundaryPaths = [];
const bBlocks = boundariesBlock.split('<path').slice(1);
bBlocks.forEach(pb => {
  const end = pb.indexOf('/>');
  const full = pb.substring(0, end);
  const idMatch = full.match(/\sid="([^"]+)"/);
  const dMatch = full.match(/\sd="([\s\S]*?)"/);
  if (idMatch && dMatch) {
    boundaryPaths.push({
      id: idMatch[1],
      d: dMatch[1].replace(/\r?\n/g, ' ').trim()
    });
  }
});

console.log('Zone counts:');
Object.keys(pathsByZone).forEach(z => {
  console.log(`  ${z}: ${pathsByZone[z].length} paths`);
});
console.log('Boundary paths count:', boundaryPaths.length);

// Save this cleanly to a json file
const output = {
  viewBox: '0 0 954 734',
  zones: pathsByZone,
  boundaries: boundaryPaths
};

fs.writeFileSync('src/lib/nigeria-zones-data.json', JSON.stringify(output, null, 2));
console.log('Saved to src/lib/nigeria-zones-data.json');
