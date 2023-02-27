command: "osascript youtube-now-playing.widget/lib/get_url.scpt",
refreshFrequency: 1000,
style: `
top: 0;
left: 0;
width: 100%;
height: 100%;
user-select: none;
cursor: default;

.hide {
  display: none;
}

#wrapper {
  top: 50%;
  left: 50%;
  position: absolute;
  align: center;
  width: 100vw;
  height: 100vh;

  transform: translate(-50%, -50%);
  box-sizing: border-box;
  background-color: #1c1c1e;
  margin: auto;
  padding: 0px;

  > #dim {
    position: fixed;
    left: 0px;
    top: 0px;
    height: 100vh;
    width: 100vw;
    background-color: #1c1c1e;
    opacity: 0.4;
    -webkit-animation: pulse 4s infinite ease-in-out alternate;
  }

  > img {
    position: fixed;
    left: 50%;
    top: 50%;
    height: auto;
    width: 100vw;
    transform: translate(-50%,-50%);
    filter: saturate(300%) blur(50px);
  }
}

@-webkit-keyframes pulse {
    0% { opacity: 0.4; }
    100% { opacity: 0.7; }
}

#container {
  display: inline-block;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);

  text-align: center;
  color: white;
  filter: drop-shadow(0px 0px 5px #1c1c1e);

  #thumbnail {
    width: 280px;
    border-radius: 5px;
    overflow: hidden;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    transition: transform .2s;
    // background-color: black;

    > img {
      position: absolute;
      border-radius: 5px;
      left: 50%;
      top: 50%;
      height: auto;
      width: 100%;
      transform: translate(-50%,-50%);
    }
  }

  #thumbnail:hover {
    transfrom: scale(1.3);
  }

  #thumbnail:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
}

@-webkit-keyframes spin {
    100%{ -webkit-transform: rotate(360deg); }
}

#title {
  font-size: 20px;
  font-family: sans-serif;
  overflow: visible;
  white-space: no-wrap;
  // margin-top: 100px;

  > .spin {
    display: inline-block;
    transform-origin: center;
    text-align: center;
    vertical-align: middle;
    -webkit-animation: spin 1000ms infinite linear;
  }
}
`,
render: () => `
  <span id='wrapper' url=''>
    <img alt='background' draggable='false'/>
    <div id='dim'></div>
    <div id='container'>
      <div id='thumbnail'>
        <img alt='thumbnail' draggable='false'/>
      </div>
      <div id='title'>title</div>
    </div>
  </span>
`,
update: (output, dom) => {
  const wrapper = document.getElementById('wrapper');
  if (output.trim().length == 0) {
    wrapper.classList.add('hide');
    return;
  }
  const [title, url] = output.split('\n')
  if (url.includes('youtube.com')) {
    let id = null;
    try {
      id = (
        url.split('?', 2)[1]
        .split('&')
        .findLast(s => s.includes('v='))
        .split('=')[1].trim());
    }
    catch (e) {
      wrapper.classList.add('hide');
      return;
    }

    wrapper.classList.remove('hide');

    const wrapper_img = wrapper.querySelector("img");
    const thumbnail = document.getElementById('thumbnail');
    const thumbnail_img = thumbnail.querySelector("img");
    const current_img_url = thumbnail_img.getAttribute('src');
    const title_div = document.getElementById('title');
    const img_url = `https://img.youtube.com/vi/${id}/0.jpg`
    if (current_img_url != img_url) {
      wrapper_img.setAttribute('src', img_url);
      thumbnail_img.setAttribute('src', img_url);
      const title_split = title.split(' - ');
      const title_prefix = (
          title_split.slice(0, title_split.length - 1)).join(' - ')
      title_div.innerHTML = title_prefix
    }
  }
}
