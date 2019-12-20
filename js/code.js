window.onload = function() {
  run();
  console.log(window.cy.$('#a'), 'elliot13-')
      setTimeout(() => {
        window.cy.fit(window.cy.$('#a'))
      }, 0);
  
};

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min; 
}
function run(elements) {
  if (window.cy && window.cy.destroy) {
    hideAllTippies();
  }
  let dir = 1;
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
          'border-width': 1.8,
          'text-wrap': 'wrap',
          'text-max-width': '1px',
          'text-overflow-wrap': '\n',
          'background-fit': 'cover',
          "background-color": "#eee",
          "border-color": "#666"
        }
      },
      {
        selector: ":parent",
        css: {
          padding: "4px",
          "text-valign": "top",
          "text-halign": "center",
          "background-color": "#666",
          "background-opacity": 0.2
        }
      },
      {
        selector: "edge",
        css: {
          label: "data(data)",
          "curve-style": "straight",
          "line-height": "8px",
          "line-color": "#AAAAAA",
          "target-arrow-color": "#AAAAAA",
          "line-cap": "square",
          "color": "#000",
          "text-opacity": "0.6",
          "target-arrow-shape": "triangle",
          "font-size": "8px",
          "text-margin-y": '-6',
          width: "1.5px"
        }
      },
      {
        selector: ".hoverText",
        css: {
          "color": '#1AB394',
          "line-height": "8px",
          "font-size": "8px",
          "text-margin-y": '-6'
        }
      },
      {
        selector: ".elliot",
        css: {
          "line-color": "#6B6B6B",
          "target-arrow-color": "#6B6B6B"
        }
      },
      {
        selector: ".warn",
        css: {
          "line-color": "#EDC341",
          "target-arrow-color": "#EDC341"
        }
      },
      {
        selector: ".error",
        css: {
          "line-color": "#CD5051",
          "target-arrow-color": "#CD5051"
        }
      },
      {
        selector: ".warn-hover",
        css: {
          "line-color": "#C9A537",
          "target-arrow-color": "#C9A537"
        }
      },
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
        data: { id: "f", alias: "asdasafad6" },
        position: { x: 300, y: 175 }
      }
    ],
  
    elements: {
      nodes: [
        { data: { id: "e", alias: "app4", next: 'c', index: 5 } },
        {
          data: { id: "a", alias: "app1-asdsasd-adfdsfsdf-adasads", next: ['c', 'd'], pre:'f', parent: "b", key: true, index: 1 },
        },
        {
          data: { id: "c", alias: "app2", parent: "b", pre:['a', 'e'], index: 3 },
        },
        { data: { id: "b", alias: "域1", type: 'parent', index: 2 } },
        { data: { id: "d", alias: "app3", pre: 'a', index: 4 } },
        
        {
          data: { id: "f", alias: "app5", next:'a', index: 6 },
        }
      ],
      edges: [
        { data: { id: "ad", data: "0.01s/100/1/100%", source: "a", target: "d", mid: "g" , warn: true}  },
        { data: { id: "ec", data: "0.01s/100/1/95%", source: "e", target: "c", mid: "h", error: true } },
        { data: { id: "ac", data: "0.01s/100/1/95%", source: "a", target: "c", mid: "i" } },
        { data: { id: "fa", data: "0.01s/100/1/95%", source: "f", target: "a", mid: "j" } }
      ]
    },
  
    layout: {
      name: "cola",
      flow: {axis: 'x', minSeparation: 50},
      avoidOverlap: true,
      handleDisconnected: true,
      alignment:(node) => {
        console.log(node.data('next'), 'asdas');
        const index = node.data('index');
        const next = ['c', 'd'];
        const pre = [];
        if (node.data('id') === 'e') {
          return { x: 0, y: 0 };
        } else {
          dir = dir === 1 ? -1 : 1;
          return {x:node.data('index') * dir * getRandomInt(12,20) * 1.5, y:node.data('index') * dir * getRandomInt(2, 14)} 
        }
      },
      nodeSpacing: 50,
      edgeLengthVal: 45,
      animate: true,
      userConstIter: 20,
      randomize: false,
      maxSimulationTime: 1500
    }
  }));
  
  function makeTippy(node, html, distance, placement) {
    return tippy(node.popperRef(), {
      content: html,
      trigger: "manual",
      arrow: true,
      placement,
      hideOnClick: true,
      distance,
      interactive: false
    });
  }
  
  function createTip(tag, attrs, children) {
    const el = document.createElement(tag);
  
    Object.keys(attrs).forEach(function(key) {
      const val = attrs[key];
      el.setAttribute(key, val);
    });
  
    if (children) {
      children.forEach(function(child) {
        el.appendChild(child);
      });
    }
  
    return el;
  }
  
  function createText(text) {
    const el = document.createTextNode(text);
    return el;
  }
}));

function makeTippy(node, html) {
  return tippy(node.popperRef(), {
    html: html,
    trigger: "manual",
    arrow: true,
    placement: "bottom",
    hideOnClick: true,
    distance: -50,
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
    if (deltaXPos < 9 && deltaYPos < 18) {
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
