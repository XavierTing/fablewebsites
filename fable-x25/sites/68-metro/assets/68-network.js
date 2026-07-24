/* CALDER METRO — network data.
   Hand-authored diagram geometry. All segments are 0°/45°/90°.
   Every station coordinate lies exactly on its line's polyline.
   label: [dx, dy, anchor] offset from station point. kind: t=terminus, i=interchange, d=duo capsule (shared corridor). */
window.CALDER = {
  lines: [
    {
      id: 'A', name: 'Harbor Line', color: '#d8382e', board: '#ff6a57',
      hw: 460, phase: [70, 310],
      blurb: 'Runs the waterfront end to end. The only line that never closes.',
      pts: [[140, 700], [320, 700], [440, 820], [900, 820], [1020, 700], [1280, 700]],
      stations: [
        { n: 'Westhaven Pier', x: 140, y: 700, kind: 't', label: [0, -18, 'middle'] },
        { n: 'Saltmarket', x: 280, y: 700, label: [0, -18, 'middle'] },
        { n: 'Ropewalk', x: 480, y: 820, label: [0, 32, 'middle'] },
        { n: 'Tidegate', x: 620, y: 820, label: [0, 32, 'middle'] },
        { n: 'Foundry Row', x: 760, y: 820, kind: 'i', label: [18, 36, 'start'] },
        { n: 'Drydock', x: 860, y: 820, label: [0, -20, 'middle'] },
        { n: 'Cannery', x: 1060, y: 700, label: [0, -18, 'middle'] },
        { n: 'Millpond', x: 1170, y: 700, label: [0, 32, 'middle'] },
        { n: 'Saltmeadow', x: 1280, y: 700, kind: 't', label: [0, -18, 'middle'] }
      ],
      caps: [[104, 700], [1316, 700]]
    },
    {
      id: 'B', name: 'Meridian Line', color: '#2b50d6', board: '#7c96ff',
      hw: 420, phase: [140, 395],
      blurb: 'The north–south spine. Everything meets it eventually.',
      pts: [[700, 100], [700, 220], [760, 280], [760, 940]],
      stations: [
        { n: 'Northgate', x: 700, y: 100, kind: 't', label: [-18, 5, 'end'] },
        { n: 'Birchmere', x: 700, y: 180, label: [-18, 5, 'end'] },
        { n: 'Cathedral', x: 760, y: 340, kind: 'i', label: [20, -14, 'start'] },
        { n: 'Granary', x: 760, y: 450, label: [18, 5, 'start'] },
        { n: 'Meridian Exchange', x: 760, y: 552, kind: 'i', label: [-26, 46, 'end'] },
        { n: 'Tannery', x: 760, y: 690, label: [18, 5, 'start'] },
        { n: 'Foundry Row', x: 760, y: 820, kind: 'i' },
        { n: 'Harbor Basin', x: 760, y: 940, kind: 't', label: [20, 5, 'start'] }
      ],
      caps: [[700, 64], [760, 976]]
    },
    {
      id: 'C', name: 'Crosstown Line', color: '#0e8a4c', board: '#43cf88',
      hw: 440, phase: [55, 250],
      blurb: 'East–west through the centre, sharing the corridor with E.',
      pts: [[180, 460], [300, 460], [400, 560], [1360, 560]],
      stations: [
        { n: 'Wrenfield', x: 180, y: 460, kind: 't', label: [0, -18, 'middle'] },
        { n: 'Lampwick', x: 260, y: 460, label: [0, 32, 'middle'] },
        { n: 'Brandt Yards', x: 470, y: 560, label: [0, -20, 'middle'] },
        { n: 'Printworks', x: 610, y: 560, label: [0, -20, 'middle'] },
        { n: 'Meridian Exchange', x: 760, y: 560, kind: 'i' },
        { n: 'Weavers Hall', x: 880, y: 560, kind: 'd', label: [0, -32, 'middle'] },
        { n: 'Cornhill', x: 980, y: 560, kind: 'd', label: [0, -32, 'middle'] },
        { n: 'Elmgate', x: 1180, y: 560, label: [0, -20, 'middle'] },
        { n: 'Halvorsen', x: 1360, y: 560, kind: 'ti', label: [-24, 40, 'end'] }
      ],
      caps: [[144, 460], [1398, 560]]
    },
    {
      id: 'E', name: 'Fairholt Line', color: '#e8a20c', board: '#f5b52a',
      hw: 520, phase: [220, 35],
      blurb: 'The short feeder down from the eastern hill.',
      pts: [[1120, 120], [1120, 460], [1036, 544], [760, 544]],
      stations: [
        { n: 'Fairholt', x: 1120, y: 120, kind: 't', label: [18, 5, 'start'] },
        { n: 'Pomeroy', x: 1120, y: 230, label: [18, 5, 'start'] },
        { n: 'Arsenal', x: 1120, y: 340, kind: 'i', label: [20, -14, 'start'] },
        { n: 'Cornhill', x: 980, y: 544, kind: 'd' },
        { n: 'Weavers Hall', x: 880, y: 544, kind: 'd' },
        { n: 'Meridian Exchange', x: 760, y: 544, kind: 'ti' }
      ],
      caps: [[1120, 84]]
    },
    {
      id: 'K', name: 'Kestrel Line', color: '#7048c8', board: '#ab8bff',
      hw: 480, phase: [330, 118],
      blurb: 'The long diagonal — northwest ridge to the south quays.',
      pts: [[180, 160], [400, 160], [580, 340], [1200, 340], [1360, 500], [1360, 860]],
      stations: [
        { n: 'Applegarth', x: 180, y: 160, kind: 't', label: [0, -18, 'middle'] },
        { n: 'Millbrook', x: 320, y: 160, label: [0, 32, 'middle'] },
        { n: 'Holloway Vale', x: 490, y: 250, label: [18, -6, 'start'] },
        { n: 'Cathedral', x: 760, y: 340, kind: 'i' },
        { n: 'Guildhall', x: 960, y: 340, label: [0, -20, 'middle'] },
        { n: 'Arsenal', x: 1120, y: 340, kind: 'i' },
        { n: 'Halvorsen', x: 1360, y: 560, kind: 'i' },
        { n: 'Glassworks', x: 1360, y: 700, label: [18, 5, 'start'] },
        { n: 'Southquay', x: 1360, y: 860, kind: 't', label: [18, 5, 'start'] }
      ],
      caps: [[144, 160], [1360, 896]]
    }
  ],
  /* Meridian Exchange platform assignments: [lineId, dir] -> platform */
  platforms: { 'B0': '1', 'B1': '2', 'C0': '4', 'C1': '3', 'E1': '5' },
  interchanges: {
    'Meridian Exchange': { x: 760, y: 552, r: 17 },
    'Cathedral': { x: 760, y: 340, r: 10.5 },
    'Foundry Row': { x: 760, y: 820, r: 10.5 },
    'Arsenal': { x: 1120, y: 340, r: 10.5 },
    'Halvorsen': { x: 1360, y: 560, r: 10.5 }
  },
  duos: {
    'Weavers Hall': { x: 880, y: 552 },
    'Cornhill': { x: 980, y: 552 }
  }
};
