// let items = [
//   {
//     type: "video",
//     name: "ENG.10.02.18A.mp4",
//     position: 710,
//   },
//   {
//     type: "audio",
//     name: "59 SB10 U1 B1.4 P11.mp3",
//     position: 1200,
//   },
// {
//   type: "h5p",
//   name: "145 SB9 U1 AE1-5.html",
//   position: 595,
//   height: 200
// },
// {
//   type: "dictation",
//   name: "U1.ASSMT.E1.TGP.6.SBP.18.TG.mp3",
//   title: "<b>6.</b> Dictation",
//   text: "",
//   position: 593,
//   height: 200
// }
// ];

function insertContent(rootElement, items) {
  rootElement = $(rootElement);

  items.forEach((item) => {
    setItemHeight(item);
    setItemPath(item);
  });

  const sections = getSections(items);
  const sectionElements = sections.map((section) =>
    getElementsInSection(rootElement, section)
  );

  const image = rootElement.find("img");
  const imageWidth = image.width();
  const imageHeight = image.height();
  const imageSource = image
    .prop("src")
    .substring(window.location.origin.length);
  image.remove();

  function addImage(section, shiftAmount) {
    shiftAmount = shiftAmount || 0;
    const image = $(document.createElement("div"));
    const top = section.start + shiftAmount;
    const height = (section.end || imageHeight) - section.start;
    image.css({
      position: "absolute",
      top: top,
      width: imageWidth,
      height: height,
      background: `url('${imageSource}')`,
      "background-size": "cover",
      "background-position-x": 0,
      "background-position-y": -section.start,
      "background-repeat": "no-repeat",
    });

    rootElement.prepend(image);
  }

  addImage({ start: 0, end: items[0].position });
  let totalContentHeight = 0;

  const padding = 10;
  items.forEach((item, index) => {
    const itemElement = createItemElement(item);
    itemElement.css("top", item.position + padding + totalContentHeight);
    rootElement.append(itemElement);

    totalContentHeight += item.height + padding * 2;
    shiftElementsDown(sectionElements[index + 1], totalContentHeight);
    addImage(sections[index + 1], totalContentHeight);
  });

  rootElement.height(rootElement.height() + totalContentHeight);
  removeGuide(rootElement);
}

function setItemHeight(item) {
  if (!item.height) {
    switch (item.type) {
      case "audio":
        item.height = 54;
        break;

      case "video":
        item.height = 325;
        break;

      case "title":
        item.height = 70;
        break;

      default:
        throw new Error("Height not specified for item: ", item.name);
    }
  }
}

function setItemPath(item) {
  item.src =
    item.type == "dictation"
      ? `assets/audio/${item.name}`
      : `assets/${item.type}/${item.name}`;
}

function createItemElement(item) {
  let element;

  switch (item.type) {
    case "audio":
    case "video":
      element = $(document.createElement(item.type)).prop("controls", true);
      break;

    case "title":
      element = $(document.createElement("h1"))
        .prop("class", "exercise")
        .text("INTERACTIVE EXERCISES");
      break;

    case "dictation":
      element = $(document.createElement("app-dictation")).prop({
        title: item.title,
        text: item.text,
      });
      break;

    default:
      element = $(document.createElement("iframe"));
      break;
  }

  element
    .prop("src", item.src)
    .css({ position: "absolute", height: item.height });

  return element;
}

function getSections(content) {
  const positions = content.map((c) => c.position);
  positions.unshift(0);
  const sections = [];

  for (let i = 0; i < positions.length; i++) {
    sections.push({
      start: positions[i],
      end: positions[i + 1],
    });
  }

  return sections;
}

function getElementsInSection(rootElement, section) {
  const baseOffset = rootElement.offset();
  return rootElement.find("div.t").filter(function () {
    const y = $(this).offset().top - baseOffset.top;
    return y > section.start && (section.end === undefined || y <= section.end);
  });
}

function shiftElementsDown(elements, amount) {
  elements.each(function () {
    // Shift element vertically
    let str = $(this).css("bottom");
    str = str.substring(0, str.length - 2);
    const oldPos = Number(str);
    const newPos = oldPos - amount;
    $(this).css("bottom", newPos);
  });
}

function setPage(id) {
  page = "#" + id;
  pageDiv = $(page);
  pageDiv.contextmenu(function (e) {
    e.preventDefault();
    const guide = $(document.createElement("div"))
      .css({
        position: "absolute",
        width: "100%",
        height: 5,
        background: "red",
        top: 300,
      })
      .prop("id", "guide");

    pageDiv.append(guide);

    pageDiv.on({
      mousemove: function (event) {
        guide.css({ top: event.offsetY / 1.5 });
      },
      click: function () {
        console.log("Position:", guide.css("top"));
        pageDiv.off("click mousemove");
      },
    });
  });
}

function removeGuide(rootElement) {
  $(rootElement).children("div#guide").remove();
}
