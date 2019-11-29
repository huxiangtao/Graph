const cy = (window.cy = cytoscape({
  container: document.getElementById("cy"),

  boxSelectionEnabled: false,

  style: [
    {
      selector: "node",
      css: {
        label: "data(alias)",
        "text-valign": "bottom",
        "text-halign": "center",
        "font-size": "8px",
        'background-fit': 'cover',
      }
    },
    {
      selector: ":parent",
      css: {
        padding: "4px",
        "text-valign": "top",
        "text-halign": "center"
      }
    },
    {
      selector: "edge",
      css: {
        label: "data(data)",
        "curve-style": "straight",
        "target-arrow-shape": "triangle",
        "font-size": "8px",
        width: "1px"
      }
    },
    {
      selector: ".elliot",
      css: {
        "line-color": "red"
      }
    },
    {
      selector: "#a",
      css: {
        'background-image': 'https://live.staticflickr.com/3866/14420309584_78bf471658_b.jpg'
      }
    }
  ],

  elements: {
    nodes: [
      {
        data: { id: "a", alias: "asdasafad1", parent: "b" },
        position: { x: 215, y: 85 }
      },
      { data: { id: "b", alias: "域1" } },
      {
        data: { id: "c", alias: "asdasafad3", parent: "b" },
        position: { x: 300, y: 85 }
      },
      { data: { id: "d", alias: "asdasafad4" }, position: { x: 215, y: 175 } },
      { data: { id: "e", alias: "域2" } },
      {
        data: { id: "f", alias: "asdasafad6", parent: "e" },
        position: { x: 300, y: 175 }
      }
    ],
    edges: [
      {
        data: { id: "ab", data: "0.01s/100/1/100%", source: "a", target: "d" }
      },
      { data: { id: "ec", data: "0.01s/100/1/95%", source: "e", target: "c" } },
      { data: { id: "ac", data: "0.01s/100/1/95%", source: "a", target: "c" } }
    ]
  },

  layout: {
    name: "cola",
    nodeSpacing: 50,
    edgeLengthVal: 45,
    animate: true,
    randomize: false,
    maxSimulationTime: 1500
  }
}));

function makeTippy(node, html) {
  return tippy(node.popperRef(), {
    html: html,
    trigger: "manual",
    arrow: true,
    placement: "bottom",
    hideOnClick: true,
    distance: -30,
    interactive: false
  }).tooltips[0];
}

function createTip(tag, attrs, children) {
  const el = document.createElement(tag);

  Object.keys(attrs).forEach(function(key) {
    const val = attrs[key];
    el.setAttribute(key, val);
  });

  children.forEach(function(child) {
    el.appendChild(child);
  });

  return el;
}

function createText(text) {
  const el = document.createTextNode(text);
  return el;
}

function hideTippy(node) {
  const tippy = node.data("tippy");
  if (tippy != null) {
    tippy.hide();
  }
}

function hideAllTippies() {
  cy.edges().forEach(hideTippy);
}

cy.on("tap", function(e) {
  if (e.target === cy) {
    hideAllTippies();
    cy.edges().forEach(s => s.removeClass("elliot"));
  }
});

cy.on("zoom pan", function(e) {
  hideAllTippies();
  cy.edges().forEach(s => s.removeClass("elliot"));
});

cy.edges().forEach(n => {
  const g = n.data("id");

  const $links = [
    {
      name: "错误详情",
      url: "http://www.genecards.org/cgi-bin/carddisp.pl?gene=" + g
    },
    {
      name: "UniProt search",
      url:
        "http://www.uniprot.org/uniprot/?query=" +
        g +
        "&fil=organism%3A%22Homo+sapiens+%28Human%29+%5B9606%5D%22&sort=score"
    },
    {
      name: "GeneMANIA",
      url: "http://genemania.org/search/human/" + g
    }
  ].map(function(link) {
    return createTip(
      "a",
      { target: "_blank", href: link.url, class: "tip-link" },
      [createText(link.name)]
    );
  });

  const tippy = makeTippy(n, createTip("div", {}, $links));

  n.data("tippy", tippy);

  n.on("mousemove", function(e) {
    const eventPos = e.position;
    const edgeCenterPos = n.midpoint();
    const deltaXPos = Math.abs(eventPos.x - edgeCenterPos.x);
    const deltaYPos = Math.abs(eventPos.y - edgeCenterPos.y);
    if (deltaXPos < 9 && deltaYPos < 9) {
      tippy.show();
    }
    n.addClass("elliot");
    cy.edges()
      .not(n)
      .forEach(hideTippy);
    cy.edges()
      .not(n)
      .forEach(edge => edge.removeClass("elliot"));
  });
});
