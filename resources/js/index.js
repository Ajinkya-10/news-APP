let index = 0;
async function topic_URL(){
    magazines.forEach((topic) => {
        const json_converter = "https://api.rss2json.com/v1/api.json?rss_url=";
        const feed_url = json_converter + topic;
        construct_accordion(feed_url);
    })
}

async function construct_accordion(feed_url){
    let feed_data = await fetch_feed_data(feed_url);

    index = index + 1;

    const headingId = `heading${index}`;
    const collapseId = `collapse${index}`;
    const title = `${feed_data["feed"]["title"]}`;

    create_accordion_item(headingId, collapseId, title);
    insert_carousel(feed_data["items"]);
}

async function fetch_feed_data(feed_url){
    try{
        const feed_response = await fetch(feed_url);
        const feed_data = await feed_response.json();
        return feed_data;
    } catch (error) {
        return null;
    }
}

function create_accordion_item(headingId, collapseId, title){
    const accordion_parent = document.getElementById("accordionExample");

    const accordion_item = document.createElement("div");
    accordion_item.setAttribute("class", "accordion-item");
    accordion_item.innerHTML = `
    <h2 class="accordion-header" id=${headingId}>
      <button class="accordion-button ${index !== 1 ? "collapsed" : ""}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded=${index === 1 ? "true" : "false"} aria-controls=${collapseId}>
        ${title}
      </button>
    </h2>
    <div id=${collapseId} class="accordion-collapse collapse ${index === 1 ? "show" : ""}" aria-labelledby=${headingId} data-bs-parent="#accordionExample">
      <div class="accordion-body p-0" id="accordion-body-${index}"></div>
    </div>
    `
    accordion_parent.append(accordion_item);
}

function insert_carousel(items){
    const accordion_item = document.getElementById(`accordion-body-${index}`);
    const carousel_parent = document.createElement("div");
    carousel_parent.innerHTML = `
    <div id="carouselExampleControls-${index}" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner" id="carousel-inner-${index}"></div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls-${index}" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls-${index}" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
    </div>
    `;
    accordion_item.append(carousel_parent);

    const carousel_inner = document.getElementById(`carousel-inner-${index}`);
    items.forEach((feed_item, idx) => {
      const carousel_item = document.createElement("div");
      if (idx === 0)
      {
        carousel_item.setAttribute("class", "carousel-item active");
      }
      else
      {
        carousel_item.setAttribute("class", "carousel-item");
      }
      const date = new Date(feed_item["pubDate"]);
      carousel_item.innerHTML = `
      <div class="card">
      <a href=${feed_item["link"]}>
      <img src=${feed_item["enclosure"]["link"]} class="card-img-top cardImage" alt="">
      </a>
      <div class="card-body">
      <h5 class="card-title">${feed_item["title"]}</h5>
      <p class="text-muted">${feed_item["author"]} : ${date.toLocaleString("en-IN", {dateStyle:"short"})}</p>
      <p class="card-text">${feed_item["description"]}</p>
      </div>
      </div>
      `
      carousel_inner.append(carousel_item);
    })
}

topic_URL();
