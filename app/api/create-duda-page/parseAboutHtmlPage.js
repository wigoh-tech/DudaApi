import * as cheerio from 'cheerio';

// Static HTML content (replace this with your actual HTML)
let staticHtmlContent = `
<section>



<section id="comp-lt8qhfae" tabindex="-1" class="Oqnisf comp-lt8qhfae wixui-section" data-block-level-container="ClassicSection" style="align-self: start; block-size: 1129px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 1129px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 969px 564.5px; position: relative; right: 0px; top: 0px; transform-origin: 969px 564.5px;" wig-id="{{wigoh-id-005}}">
<div id="bgLayers_comp-lt8qhfae" data-hook="bgLayers" data-motion-part="BG_LAYER comp-lt8qhfae" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 1129px; bottom: 0px; height: 1129px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 969px 564.5px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 564.5px;">
</div>
<div data-mesh-id="comp-lt8qhfaeinlineContent" data-testid="inline-content" class="" style="block-size: 1129px; bottom: 0px; height: 1129px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 969px 564.5px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 969px 564.5px;">
<div data-mesh-id="comp-lt8qhfaeinlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 1129px; display: grid; grid-template-columns: 1938px; grid-template-rows: 911px 218px; height: 1129px; perspective-origin: 969px 564.5px; pointer-events: none; transform-origin: 969px 564.5px;">
<!--$-->
<section id="comp-irqduxer" class="comp-irqduxer CohWsy wixui-column-strip" style="align-self: start; block-size: 874px; bottom: 0px; display: flex; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; margin-block-end: 30px; margin-block-start: 7px; margin-bottom: 30px; margin-top: 7px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 969px 437px; position: relative; right: 0px; top: 0px; transform-origin: 969px 437px;">
<div id="bgLayers_comp-irqduxer" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxer" class="if7Vw2 tcElKx i1tH8h wG8dni" style="block-size: 874px; bottom: 0px; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 969px 437px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 437px;">
</div>
<div data-testid="columns" class="V5AUxf" style="block-size: 874px; bottom: 0px; column-gap: 0px; display: flex; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 969px 437px; position: relative; right: 0px; top: 0px; transform-origin: 969px 437px;">
<!--$-->
<div id="comp-irqduxf8" class="comp-irqduxf8 YzqVVZ wixui-column-strip__column" style="--motion-comp-height: 874px;; block-size: 874px; bottom: 0px; flex-basis: 0%; flex-grow: 980; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 969px 437px; position: relative; right: 0px; top: 0px; transform-origin: 969px 437px;">
<div id="bgLayers_comp-irqduxf8" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxf8" class="MW5IWV LWbAav Kv1aVt" style="block-size: 874px; bottom: 0px; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; background-color: rgb(6, 21, 81); mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: clip; overflow-inline: clip; overflow-x: clip; overflow-y: clip; perspective-origin: 969px 437px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 437px;">
<div id="bgMedia_comp-irqduxf8" data-motion-part="BG_MEDIA comp-irqduxf8" class="VgO9Yg" style="block-size: 3070px; height: 3070px; isolation: isolate; margin-block-start: -1098px; margin-top: -1098px; perspective-origin: 969px 1535px; transform-origin: 969px 1535px;">
<wix-video id="videoContainer_comp-irqduxf8" data-video-info="{&quot;fittingType&quot;:&quot;fill&quot;,&quot;alignType&quot;:&quot;center&quot;,&quot;hasBgScrollEffect&quot;:&quot;&quot;,&quot;bgEffectName&quot;:&quot;&quot;,&quot;videoId&quot;:&quot;video/11062b_0fcc5b5d1613468aad7802063185e9d1&quot;,&quot;videoWidth&quot;:1920,&quot;videoHeight&quot;:1080,&quot;qualities&quot;:[{&quot;quality&quot;:&quot;480p&quot;,&quot;size&quot;:409920},{&quot;quality&quot;:&quot;720p&quot;,&quot;size&quot;:921600},{&quot;quality&quot;:&quot;1080p&quot;,&quot;size&quot;:2073600}],&quot;isVideoDataExists&quot;:&quot;1&quot;,&quot;videoFormat&quot;:&quot;mp4&quot;,&quot;playbackRate&quot;:1,&quot;autoPlay&quot;:true,&quot;containerId&quot;:&quot;comp-irqduxf8&quot;,&quot;animatePoster&quot;:&quot;none&quot;}" data-motion-part="BG_IMG comp-irqduxf8" class="bX9O_S bgVideo yK6aSC" style="block-size: 1098px; display: block; height: 1098px; inline-size: 1938px; inset-block-start: 0px; opacity: 0.25; perspective-origin: 969px 549px; position: sticky; top: 0px; transform-origin: 969px 549px; width: 1938px;">
<video id="comp-irqduxf8_video" class="K8MSra" crossorigin="anonymous" playsinline="" preload="auto" muted="" loop="" autoplay="" src="assets/media_65.mp4" style="height: 100%; width: 100%; object-fit: cover; object-position: center center; opacity: 1;; block-size: 1098px; bottom: 0px; display: block; height: 1098px; inline-size: 1938px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; object-fit: cover; perspective-origin: 969px 549px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 549px; width: 1938px;">
</video>
<wow-image id="comp-irqduxf8_img" class="HlRz5e Z_wCwr Jxk_UL bgVideoposter yK6aSC" data-image-info="{&quot;containerId&quot;:&quot;comp-irqduxf8&quot;,&quot;alignType&quot;:&quot;center&quot;,&quot;displayMode&quot;:&quot;fill&quot;,&quot;targetWidth&quot;:980,&quot;targetHeight&quot;:874,&quot;isLQIP&quot;:true,&quot;encoding&quot;:&quot;AVIF&quot;,&quot;imageData&quot;:{&quot;width&quot;:1920,&quot;height&quot;:1080,&quot;uri&quot;:&quot;11062b_0fcc5b5d1613468aad7802063185e9d1f000.jpg&quot;,&quot;name&quot;:&quot;&quot;,&quot;displayMode&quot;:&quot;fill&quot;,&quot;quality&quot;:{&quot;unsharpMask&quot;:{&quot;radius&quot;:0.33,&quot;amount&quot;:1,&quot;threshold&quot;:0}},&quot;devicePixelRatio&quot;:1}}" data-motion-part="BG_IMG comp-irqduxf8" data-bg-effect-name="" data-has-ssr-src="true" style="opacity: 0;; block-size: 1098px; display: block; height: 1098px; inline-size: 1938px; inset-block-start: 0px; opacity: 0; perspective-origin: 969px 549px; position: sticky; top: 0px; transform-origin: 969px 549px; width: 1938px;">
<img src="assets/11062b_0fcc5b5d1613468aad7802063185e9d1f000.jpg" alt="" style="width: 1938px; height: 1098px; object-fit: cover; object-position: 50% 50%;; block-size: 1098px; height: 1098px; inline-size: 1938px; max-inline-size: 100%; max-width: 100%; object-fit: cover; perspective-origin: 969px 549px; transform-origin: 969px 549px; width: 1938px;" width="980" height="874" data-ssr-src-done="true" fetchpriority="high">
</wow-image>
</wix-video>
</div>
</div>
<div data-mesh-id="comp-irqduxf8inlineContent" data-testid="inline-content" class="" style="block-size: 874px; bottom: 0px; height: 874px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 969px 437px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 969px 437px;">
<div data-mesh-id="comp-irqduxf8inlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 874px; display: grid; grid-template-columns: 1938px; grid-template-rows: 158px 133px 15px 33px 40px 41px 324px 57px 73px; height: 874px; perspective-origin: 969px 437px; pointer-events: none; transform-origin: 969px 437px;">
<!--$-->
<div id="comp-isehzfde2" class="comp-isehzfde2 wixui-vector-image AKxYR5 VZYmYf" data-motion-enter="done" style="align-self: start; block-size: 57px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 57px; inline-size: 60px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -828px; inset-inline-start: 828px; justify-self: start; left: 828px; margin-block-end: -7px; margin-block-start: 108px; margin-bottom: -7px; margin-inline-start: 479px; margin-left: 479px; margin-top: 108px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 30px 28.5px; position: relative; right: -828px; top: 0px; transform-origin: 30px 28.5px; width: 60px;">
  <div data-testid="svgRoot-comp-isehzfde2" style="block-size: 57px; bottom: 0px; fill: rgb(133, 77, 255); height: 57px; inline-size: 60px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 30px 28.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 30px 28.5px; width: 60px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
    <svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true" style="block-size: 57px; bottom: 0px; display: block; fill: rgb(133, 77, 255); height: 57px; inline-size: 60px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-clip-margin: content-box; perspective-origin: 30px 28.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 30px 28.5px; vector-effect: non-scaling-stroke; width: 60px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<g style="fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3
S141.4,88.3,149.8,80z" style="d: path(&quot;M 149.8 80 L 187.6 42.2 C 195.9 33.9 195.9 20.3 187.6 11.9 S 165.7 3.6 157.3 11.9 L 119.5 49.7 C 111.2 58 111.2 71.6 119.5 80 S 141.4 88.3 149.8 80 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3
S57.6,111.7,49.2,120z" style="d: path(&quot;M 49.2 120 L 11.4 157.8 C 3.1 166.1 3.1 179.7 11.4 188.1 S 33.3 196.4 41.7 188.1 L 79.5 150.3 C 87.8 142 87.8 128.4 79.5 120 S 57.6 111.7 49.2 120 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3
L149.8,120z" style="d: path(&quot;M 149.8 120 C 141.5 111.7 127.9 111.7 119.5 120 S 111.2 141.9 119.5 150.3 L 157.3 188.1 C 165.6 196.4 179.2 196.4 187.6 188.1 S 195.9 166.2 187.6 157.8 L 149.8 120 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12
z" style="d: path(&quot;M 41.7 12 C 33.4 3.7 19.8 3.7 11.4 12 S 3.1 33.9 11.4 42.3 L 49.2 80 C 57.5 88.3 71.1 88.3 79.5 80 S 87.8 58.1 79.5 49.7 L 41.7 12 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
</g>
</svg>
  </div>
</div>
<!--/$-->
<!--$-->
<div id="comp-irqduxfv" class="HcOXKn c9GqVL QxJLC3 lq2cno YQcXTT comp-irqduxfv wixui-rich-text" data-testid="richTextElement" ariaattributes="[object Object]" style="--motion-clip-start: polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%); --motion-translate-x: 0%; --motion-translate-y: 100%;; align-self: start; block-size: 132px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 132px; inline-size: 988px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; margin-block-end: 1px; margin-bottom: 1px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 494px 66px; pointer-events: none; position: relative; right: 0px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 494px 66px; width: 988px;" data-motion-enter="done">
<h1 class="font_3 wixui-rich-text__text" style="line-height:1.2em; text-align:center; font-size:55px;; block-size: 132px; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; font-size: 55px; height: 132px; inline-size: 988px; line-height: 66px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; perspective-origin: 494px 66px; text-align: center; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 494px 66px; width: 988px; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46);">
<span style="letter-spacing:normal;; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; font-size: 55px; font-weight: 700; line-height: 66px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; text-align: center; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46);" class="wixui-rich-text__text">
<span class="color_11 wixui-rich-text__text" style="border-block-end-color: rgb(255, 255, 255); border-block-start-color: rgb(255, 255, 255); border-bottom-color: rgb(255, 255, 255); border-inline-end-color: rgb(255, 255, 255); border-inline-start-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-top-color: rgb(255, 255, 255); caret-color: rgb(255, 255, 255); color: rgb(255, 255, 255); column-rule-color: rgb(255, 255, 255); font-family: raleway, sans-serif; font-size: 55px; font-weight: 700; line-height: 66px; outline-color: rgb(255, 255, 255); overflow-wrap: break-word; text-align: center; text-decoration: none solid rgb(255, 255, 255); text-decoration-color: rgb(255, 255, 255); text-emphasis-color: rgb(255, 255, 255); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; -webkit-text-fill-color: rgb(255, 255, 255); -webkit-text-stroke-color: rgb(255, 255, 255);">The smartest way to manage your d</span>
</span>
<span style="letter-spacing:normal;; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; font-size: 55px; font-weight: 700; line-height: 66px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; text-align: center; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46);" class="wixui-rich-text__text">
<span class="color_11 wixui-rich-text__text" style="border-block-end-color: rgb(255, 255, 255); border-block-start-color: rgb(255, 255, 255); border-bottom-color: rgb(255, 255, 255); border-inline-end-color: rgb(255, 255, 255); border-inline-start-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-top-color: rgb(255, 255, 255); caret-color: rgb(255, 255, 255); color: rgb(255, 255, 255); column-rule-color: rgb(255, 255, 255); font-family: raleway, sans-serif; font-size: 55px; font-weight: 700; line-height: 66px; outline-color: rgb(255, 255, 255); overflow-wrap: break-word; text-align: center; text-decoration: none solid rgb(255, 255, 255); text-decoration-color: rgb(255, 255, 255); text-emphasis-color: rgb(255, 255, 255); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; -webkit-text-fill-color: rgb(255, 255, 255); -webkit-text-stroke-color: rgb(255, 255, 255);">ta</span>
</span>
</h1>
</div>
<!--/$-->
<!--$-->
<div id="comp-isehzfdf" class="comp-isehzfdf wixui-vector-image AKxYR5 VZYmYf" data-motion-enter="done" style="align-self: start; block-size: 44px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 5; grid-row-start: 4; height: 44px; inline-size: 31px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -25px; inset-inline-start: 25px; justify-self: start; left: 25px; margin-block-end: -11px; margin-bottom: -11px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 15.5px 22px; position: relative; right: -25px; top: 0px; transform-origin: 15.5px 22px; width: 31px;">
  <div data-testid="svgRoot-comp-isehzfdf" style="block-size: 44px; bottom: 0px; fill: rgb(133, 77, 255); height: 44px; inline-size: 31px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 15.5px 22px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 15.5px 22px; width: 31px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
    <svg preserveAspectRatio="xMidYMid meet" data-bbox="1 1 198 198" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="1 1 198 198" role="presentation" aria-hidden="true" style="block-size: 44px; bottom: 0px; display: block; fill: rgb(133, 77, 255); height: 44px; inline-size: 31px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-clip-margin: content-box; perspective-origin: 15.5px 22px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 15.5px 22px; vector-effect: non-scaling-stroke; width: 31px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<g style="fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<path class="st0" d="M181.9,83H117V18.1C117,8.7,109.4,1,100,1c-9.4,0-17,7.7-17,17.1V83H18.1C8.7,83,1,90.6,1,100
c0,9.4,7.7,17,17.1,17H83v64.9c0,9.4,7.6,17.1,17,17.1c9.4,0,17-7.7,17-17.1V117h64.9c9.4,0,17.1-7.6,17.1-17
C199,90.6,191.3,83,181.9,83z" style="d: path(&quot;M 181.9 83 H 117 V 18.1 C 117 8.7 109.4 1 100 1 C 90.6 1 83 8.7 83 18.1 V 83 H 18.1 C 8.7 83 1 90.6 1 100 C 1 109.4 8.7 117 18.1 117 H 83 V 181.9 C 83 191.3 90.6 199 100 199 C 109.4 199 117 191.3 117 181.9 V 117 H 181.9 C 191.3 117 199 109.4 199 100 C 199 90.6 191.3 83 181.9 83 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
</g>
</svg>
  </div>
</div>
<!--/$-->
<!--$-->
<div id="comp-irqduxg0" class="HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxg0 wixui-rich-text" data-testid="richTextElement" ariaattributes="[object Object]" data-motion-enter="done" style="align-self: start; block-size: 21px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 21px; inline-size: 637px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -171px; inset-inline-start: 171px; justify-self: start; left: 171px; margin-block-end: -6px; margin-bottom: -6px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 318.5px 10.5px; pointer-events: none; position: relative; right: -171px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 318.5px 10.5px; width: 637px;">
<h6 class="font_6 wixui-rich-text__text" style="text-align:center; font-size:18px;; block-size: 21px; border-block-end-color: rgb(89, 51, 170); border-block-start-color: rgb(89, 51, 170); border-bottom-color: rgb(89, 51, 170); border-inline-end-color: rgb(89, 51, 170); border-inline-start-color: rgb(89, 51, 170); border-left-color: rgb(89, 51, 170); border-right-color: rgb(89, 51, 170); border-top-color: rgb(89, 51, 170); caret-color: rgb(89, 51, 170); color: rgb(89, 51, 170); column-rule-color: rgb(89, 51, 170); font-family: raleway, sans-serif; font-size: 18px; font-weight: 400; height: 21px; inline-size: 637px; outline-color: rgb(89, 51, 170); overflow-wrap: break-word; perspective-origin: 318.5px 10.5px; text-align: center; text-decoration: none solid rgb(89, 51, 170); text-decoration-color: rgb(89, 51, 170); text-emphasis-color: rgb(89, 51, 170); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 318.5px 10.5px; width: 637px; -webkit-text-fill-color: rgb(89, 51, 170); -webkit-text-stroke-color: rgb(89, 51, 170);">
<span class="color_11 wixui-rich-text__text" style="border-block-end-color: rgb(255, 255, 255); border-block-start-color: rgb(255, 255, 255); border-bottom-color: rgb(255, 255, 255); border-inline-end-color: rgb(255, 255, 255); border-inline-start-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-top-color: rgb(255, 255, 255); caret-color: rgb(255, 255, 255); color: rgb(255, 255, 255); column-rule-color: rgb(255, 255, 255); font-family: raleway, sans-serif; font-size: 18px; outline-color: rgb(255, 255, 255); overflow-wrap: break-word; text-align: center; text-decoration: none solid rgb(255, 255, 255); text-decoration-color: rgb(255, 255, 255); text-emphasis-color: rgb(255, 255, 255); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; -webkit-text-fill-color: rgb(255, 255, 255); -webkit-text-stroke-color: rgb(255, 255, 255);">I'm a title. Click here to add your own text and edit me.</span>
</h6>
</div>
<!--/$-->
<!--$-->
<div class="comp-irqduxg4 FubTgk" id="comp-irqduxg4" aria-disabled="false" data-motion-enter="done" style="align-self: start; block-size: 49px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 6; grid-row-start: 5; height: 49px; inline-size: 202px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -384px; inset-inline-start: 384px; justify-self: start; left: 384px; margin-block-end: -9px; margin-bottom: -9px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 101px 24.5px; position: relative; right: -384px; top: 0px; transform-origin: 101px 24.5px; width: 202px;">
<a data-testid="linkElement" data-anchor="dataItem-irteb1qp" data-anchor-comp-id="comp-irteb1ql" href="wigoh" target="_self" class="uDW_Qe wixui-button PlZyDq" aria-disabled="false" aria-label="Request demo" style="align-items: center; background-color: rgb(133, 77, 255); block-size: 49px; border-block-end-color: rgba(255, 255, 255, 0); border-block-end-style: solid; border-block-end-width: 1px; border-block-start-color: rgba(255, 255, 255, 0); border-block-start-style: solid; border-block-start-width: 1px; border-bottom-color: rgba(255, 255, 255, 0); border-bottom-left-radius: 50px; border-bottom-right-radius: 50px; border-bottom-style: solid; border-bottom-width: 1px; border-end-end-radius: 50px; border-end-start-radius: 50px; border-inline-end-color: rgba(255, 255, 255, 0); border-inline-end-style: solid; border-inline-end-width: 1px; border-inline-start-color: rgba(255, 255, 255, 0); border-inline-start-style: solid; border-inline-start-width: 1px; border-left-color: rgba(255, 255, 255, 0); border-left-style: solid; border-left-width: 1px; border-right-color: rgba(255, 255, 255, 0); border-right-style: solid; border-right-width: 1px; border-start-end-radius: 50px; border-start-start-radius: 50px; border-top-color: rgba(255, 255, 255, 0); border-top-left-radius: 50px; border-top-right-radius: 50px; border-top-style: solid; border-top-width: 1px; bottom: 0px; box-sizing: border-box; caret-color: rgb(0, 0, 238); color: rgb(0, 0, 238); column-rule-color: rgb(0, 0, 238); display: flex; height: 49px; inline-size: 202px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-content: center; left: 0px; min-inline-size: 100%; min-width: 100%; outline-color: rgb(0, 0, 238); perspective-origin: 101px 24.5px; position: absolute; right: 0px; text-decoration: none solid rgb(0, 0, 238); text-decoration-color: rgb(0, 0, 238); text-emphasis-color: rgb(0, 0, 238); top: 0px; touch-action: manipulation; transform-origin: 101px 24.5px; transition-behavior: normal, normal; transition-delay: 0s, 0s; transition-duration: 0.4s, 0.4s; transition-property: border-color, background-color; transition-timing-function: ease, ease; width: 202px; -webkit-text-fill-color: rgb(0, 0, 238); -webkit-text-stroke-color: rgb(0, 0, 238);">
<span class="l7_2fn wixui-button__label" style="block-size: 22.3984px; border-block-end-color: rgb(255, 255, 255); border-block-start-color: rgb(255, 255, 255); border-bottom-color: rgb(255, 255, 255); border-inline-end-color: rgb(255, 255, 255); border-inline-start-color: rgb(255, 255, 255); border-left-color: rgb(255, 255, 255); border-right-color: rgb(255, 255, 255); border-top-color: rgb(255, 255, 255); bottom: 0px; caret-color: rgb(255, 255, 255); color: rgb(255, 255, 255); column-rule-color: rgb(255, 255, 255); cursor: pointer; display: block; font-family: raleway, sans-serif; font-size: 16px; font-weight: 700; height: 22.3984px; inline-size: 111.906px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; line-height: 22.4px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; outline-color: rgb(255, 255, 255); perspective-origin: 55.9531px 11.1953px; position: relative; right: 0px; text-decoration: none solid rgb(255, 255, 255); text-decoration-color: rgb(255, 255, 255); text-emphasis-color: rgb(255, 255, 255); text-wrap-mode: nowrap; top: 0px; transform-origin: 55.9531px 11.1992px; transition-duration: 0.4s; transition-property: color; width: 111.906px; -webkit-text-fill-color: rgb(255, 255, 255); -webkit-text-stroke-color: rgb(255, 255, 255);">Request demo</span>
</a>
</div>
<!--/$-->
<!--$-->
<div id="comp-isei16an" class="comp-isei16an wixui-vector-image AKxYR5 VZYmYf" data-motion-enter="done" style="align-self: start; block-size: 31px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 7; grid-row-start: 6; height: 31px; inline-size: 36px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -912px; inset-inline-start: 912px; justify-self: start; left: 912px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 18px 15.5px; position: relative; right: -912px; top: 0px; transform-origin: 18px 15.5px; width: 36px;">
  <div data-testid="svgRoot-comp-isei16an" style="block-size: 31px; bottom: 0px; fill: rgb(133, 77, 255); height: 31px; inline-size: 36px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 18px 15.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 18px 15.5px; width: 36px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.1 5.1 189.8 189.8" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.1 5.1 189.8 189.8" role="presentation" aria-hidden="true" style="block-size: 31px; bottom: 0px; display: block; fill: rgb(133, 77, 255); height: 31px; inline-size: 36px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-clip-margin: content-box; perspective-origin: 18px 15.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 18px 15.5px; vector-effect: non-scaling-stroke; width: 36px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<g style="fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<path class="st0" d="M100,5.1C47.6,5.1,5.1,47.6,5.1,100c0,52.4,42.5,94.9,94.9,94.9c52.4,0,94.9-42.5,94.9-94.9
C194.9,47.6,152.4,5.1,100,5.1z M100,160.4c-33.3,0-60.4-27-60.4-60.4c0-33.3,27-60.4,60.4-60.4c33.3,0,60.4,27,60.4,60.4
C160.4,133.3,133.3,160.4,100,160.4z" style="d: path(&quot;M 100 5.1 C 47.6 5.1 5.1 47.6 5.1 100 C 5.1 152.4 47.6 194.9 100 194.9 C 152.4 194.9 194.9 152.4 194.9 100 C 194.9 47.6 152.4 5.1 100 5.1 Z M 100 160.4 C 66.7 160.4 39.6 133.4 39.6 100 C 39.6 66.7 66.6 39.6 100 39.6 C 133.3 39.6 160.4 66.6 160.4 100 C 160.4 133.3 133.3 160.4 100 160.4 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
</g>
</svg></div>
</div>
<!--/$-->
<!--$-->
<div id="comp-isehzfdf1" class="comp-isehzfdf1 wixui-vector-image AKxYR5 VZYmYf" data-motion-enter="done" style="align-self: start; block-size: 55px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 9; grid-row-start: 8; height: 55px; inline-size: 46px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 139px; inset-inline-start: -139px; justify-self: start; left: -139px; margin-block-end: 2px; margin-bottom: 2px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 23px 27.5px; position: relative; right: 139px; top: 0px; transform-origin: 23px 27.5px; width: 46px;">
  <div data-testid="svgRoot-comp-isehzfdf1" style="block-size: 55px; bottom: 0px; fill: rgb(133, 77, 255); height: 55px; inline-size: 46px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 23px 27.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 23px 27.5px; width: 46px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.1 5.1 189.8 189.8" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.1 5.1 189.8 189.8" role="presentation" aria-hidden="true" style="block-size: 55px; bottom: 0px; display: block; fill: rgb(133, 77, 255); height: 55px; inline-size: 46px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-clip-margin: content-box; perspective-origin: 23px 27.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 23px 27.5px; vector-effect: non-scaling-stroke; width: 46px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<g style="fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<path class="st0" d="M100,5.1C47.6,5.1,5.1,47.6,5.1,100c0,52.4,42.5,94.9,94.9,94.9c52.4,0,94.9-42.5,94.9-94.9
C194.9,47.6,152.4,5.1,100,5.1z M100,160.4c-33.3,0-60.4-27-60.4-60.4c0-33.3,27-60.4,60.4-60.4c33.3,0,60.4,27,60.4,60.4
C160.4,133.3,133.3,160.4,100,160.4z" style="d: path(&quot;M 100 5.1 C 47.6 5.1 5.1 47.6 5.1 100 C 5.1 152.4 47.6 194.9 100 194.9 C 152.4 194.9 194.9 152.4 194.9 100 C 194.9 47.6 152.4 5.1 100 5.1 Z M 100 160.4 C 66.7 160.4 39.6 133.4 39.6 100 C 39.6 66.7 66.6 39.6 100 39.6 C 133.3 39.6 160.4 66.6 160.4 100 C 160.4 133.3 133.3 160.4 100 160.4 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
</g>
</svg></div>
</div>
<!--/$-->
<!--$-->
<div id="comp-isejgyj5" class="comp-isejgyj5 wixui-vector-image AKxYR5 VZYmYf" data-motion-enter="done" style="align-self: start; block-size: 22px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 10; grid-row-start: 9; height: 22px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 94px; inset-inline-start: -94px; justify-self: start; left: -94px; margin-block-end: 51px; margin-bottom: 51px; margin-inline-start: 479px; margin-left: 479px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 12px 11px; position: relative; right: 94px; top: 0px; transform-origin: 12px 11px; width: 24px;">
  <div data-testid="svgRoot-comp-isejgyj5" style="block-size: 22px; bottom: 0px; fill: rgb(133, 77, 255); height: 22px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 12px 11px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 12px 11px; width: 24px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true" style="block-size: 22px; bottom: 0px; display: block; fill: rgb(133, 77, 255); height: 22px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-clip-margin: content-box; perspective-origin: 12px 11px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 12px 11px; vector-effect: non-scaling-stroke; width: 24px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<g style="fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
<path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3
S141.4,88.3,149.8,80z" style="d: path(&quot;M 149.8 80 L 187.6 42.2 C 195.9 33.9 195.9 20.3 187.6 11.9 S 165.7 3.6 157.3 11.9 L 119.5 49.7 C 111.2 58 111.2 71.6 119.5 80 S 141.4 88.3 149.8 80 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3
S57.6,111.7,49.2,120z" style="d: path(&quot;M 49.2 120 L 11.4 157.8 C 3.1 166.1 3.1 179.7 11.4 188.1 S 33.3 196.4 41.7 188.1 L 79.5 150.3 C 87.8 142 87.8 128.4 79.5 120 S 57.6 111.7 49.2 120 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3
L149.8,120z" style="d: path(&quot;M 149.8 120 C 141.5 111.7 127.9 111.7 119.5 120 S 111.2 141.9 119.5 150.3 L 157.3 188.1 C 165.6 196.4 179.2 196.4 187.6 188.1 S 195.9 166.2 187.6 157.8 L 149.8 120 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
<path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12
z" style="d: path(&quot;M 41.7 12 C 33.4 3.7 19.8 3.7 11.4 12 S 3.1 33.9 11.4 42.3 L 49.2 80 C 57.5 88.3 71.1 88.3 79.5 80 S 87.8 58.1 79.5 49.7 L 41.7 12 Z&quot;); fill: rgb(133, 77, 255); stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; vector-effect: non-scaling-stroke; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
</path>
</g>
</svg></div>
</div>
<!--/$-->
<div data-mesh-id="comp-irqduxf8inlineContent-wedge-8" style="block-size: 744px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 8; grid-row-start: 1; height: 744px; inline-size: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 0px 372px; transform-origin: 0px 372px; visibility: hidden; width: 0px;">
</div>
</div>
</div>
</div>
<!--/$-->
</div>
</section>
<!--/$-->
<!--$-->
<section id="comp-irqdux7i" class="comp-irqdux7i CohWsy wixui-column-strip" style="align-self: start; block-size: 218px; bottom: 0px; display: flex; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 969px 109px; position: relative; right: 0px; top: 0px; transform-origin: 969px 109px;">
<div id="bgLayers_comp-irqdux7i" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqdux7i" class="if7Vw2 tcElKx i1tH8h wG8dni" style="block-size: 218px; bottom: 0px; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 969px 109px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 109px;">
<div id="bgMedia_comp-irqdux7i" data-motion-part="BG_MEDIA comp-irqdux7i" style="block-size: 218px; height: 218px; perspective-origin: 969px 109px; transform-origin: 969px 109px;">
</div>
</div>
<div data-testid="columns" class="V5AUxf" style="block-size: 218px; bottom: 0px; column-gap: 0px; display: flex; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 969px 109px; position: relative; right: 0px; top: 0px; transform-origin: 969px 109px;">
<!--$-->
<div id="comp-irqdux85" class="comp-irqdux85 YzqVVZ wixui-column-strip__column" style="block-size: 218px; bottom: 0px; flex-basis: 0%; flex-grow: 980; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 969px 109px; position: relative; right: 0px; top: 0px; transform-origin: 969px 109px;">
<div id="bgLayers_comp-irqdux85" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqdux85" class="MW5IWV LWbAav Kv1aVt" style="block-size: 218px; bottom: 0px; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; background-color: rgb(255, 255, 255); mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 969px 109px; position: absolute; right: 0px; top: 0px; transform-origin: 969px 109px;">
<div id="bgMedia_comp-irqdux85" data-motion-part="BG_MEDIA comp-irqdux85" class="VgO9Yg" style="block-size: 218px; height: 218px; perspective-origin: 969px 109px; transform-origin: 969px 109px;">
</div>
</div>
<div data-mesh-id="comp-irqdux85inlineContent" data-testid="inline-content" class="" style="block-size: 218px; bottom: 0px; display: flex; height: 218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 969px 109px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 969px 109px;">
<div data-mesh-id="comp-irqdux85inlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 645px; display: grid; grid-template-columns: 1938px; grid-template-rows: 645px; height: 645px; margin-block-start: -427px; margin-top: -427px; min-block-size: 645px; min-height: 645px; min-inline-size: auto; min-width: auto; perspective-origin: 969px 322.5px; pointer-events: none; transform-origin: 969px 322.5px;">
<!--$-->
<div id="comp-irqduxgc" class="comp-irqduxgc mDzRgi QodGTM ignore-focus wixui-slideshow" role="region" tabindex="-1" aria-label="Slideshow" data-motion-enter="done" style="align-self: start; block-size: 559px; bottom: 0px; box-sizing: border-box; display: grid; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -37px; inset-inline-start: 37px; justify-self: start; left: 37px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 479px; margin-left: 479px; min-block-size: 50px; min-height: 50px; min-inline-size: auto; min-width: auto; perspective-origin: 452.5px 279.5px; position: relative; right: -37px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
<button data-testid="prevButton" aria-label="Previous" class="XvQ3FE CdshHv" style="align-self: center; block-size: 36.6875px; bottom: 261.156px; cursor: pointer; display: block; grid-column-end: 1; grid-column-start: 1; grid-row-end: 1; grid-row-start: 1; height: 36.6875px; inline-size: 17px; inset-block-end: 261.156px; inset-block-start: 261.156px; inset-inline-end: 927px; inset-inline-start: 0px; justify-self: start; left: 0px; margin-inline-end: -19.5px; margin-inline-start: -19.5px; margin-left: -19.5px; margin-right: -19.5px; perspective-origin: 8.5px 18.3438px; position: absolute; right: 927px; top: 261.156px; transform: matrix(1, 0, 0, 1, 0, 0); transform-origin: 8.5px 18.3438px; width: 17px; z-index: 1;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 41" style="block-size: 33.1875px; cursor: pointer; fill: rgb(240, 240, 240); font-family: Arial; font-size: 13.3333px; height: 33.1875px; inline-size: 17px; overflow-block: hidden; overflow-clip-margin: content-box; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 8.5px 16.5938px; stroke: rgb(240, 240, 240); text-align: center; transform-origin: 8.5px 16.5938px; width: 17px;">
<path d="M20.3 40.8 0 20.5 20.3.2l.7.7L1.3 20.5 21 40.1z" style="cursor: pointer; d: path(&quot;M 20.3 40.8 L 0 20.5 L 20.3 0.2 L 21 0.9 L 1.3 20.5 L 21 40.1 Z&quot;); fill: rgb(240, 240, 240); font-family: Arial; font-size: 13.3333px; stroke: rgb(240, 240, 240); text-align: center;">
</path>
</svg>
</button>
<button data-testid="nextButton" aria-label="Next" class="XvQ3FE Qinjwp" style="align-self: center; block-size: 36.6875px; bottom: 261.156px; cursor: pointer; display: block; grid-column-end: 1; grid-column-start: 1; grid-row-end: 1; grid-row-start: 1; height: 36.6875px; inline-size: 17px; inset-block-end: 261.156px; inset-block-start: 261.156px; inset-inline-end: 0px; inset-inline-start: 927px; justify-self: end; left: 927px; margin-inline-end: -19.5px; margin-inline-start: -19.5px; margin-left: -19.5px; margin-right: -19.5px; perspective-origin: 8.5px 18.3438px; position: absolute; right: 0px; top: 261.156px; transform: matrix(-1, 0, 0, 1, 0, 0); transform-origin: 8.5px 18.3438px; width: 17px; z-index: 1;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 41" style="block-size: 33.1875px; cursor: pointer; fill: rgb(240, 240, 240); font-family: Arial; font-size: 13.3333px; height: 33.1875px; inline-size: 17px; overflow-block: hidden; overflow-clip-margin: content-box; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 8.5px 16.5938px; stroke: rgb(240, 240, 240); text-align: center; transform-origin: 8.5px 16.5938px; width: 17px;">
<path d="M20.3 40.8 0 20.5 20.3.2l.7.7L1.3 20.5 21 40.1z" style="cursor: pointer; d: path(&quot;M 20.3 40.8 L 0 20.5 L 20.3 0.2 L 21 0.9 L 1.3 20.5 L 21 40.1 Z&quot;); fill: rgb(240, 240, 240); font-family: Arial; font-size: 13.3333px; stroke: rgb(240, 240, 240); text-align: center;">
</path>
</svg>
</button>
<div data-testid="shadowLayer" class="N2NGoO" style="block-size: 559px; bottom: 0px; box-shadow: rgba(0, 0, 0, 0.6) 0px 0px 0px 0px; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 452.5px 279.5px; pointer-events: none; position: absolute; right: 0px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
<div data-testid="slidesWrapper" aria-live="polite" class="hDJzl4" style="block-size: 559px; bottom: 0px; grid-column-end: 1; grid-column-start: 1; grid-row-end: 1; grid-row-start: 1; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-block: clip; overflow-inline: clip; overflow-x: clip; overflow-y: clip; perspective-origin: 452.5px 279.5px; position: absolute; right: 0px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
<!--$-->
<div id="comp-irt9hbxb" class="comp-irt9hbxb imK94d" style="block-size: 559px; bottom: 0px; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; overflow-block: clip; overflow-inline: clip; overflow-x: clip; overflow-y: clip; perspective-origin: 452.5px 279.5px; position: absolute; right: 0px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
<div id="bgLayers_comp-irt9hbxb" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irt9hbxb" class="MW5IWV eF_jBL LWbAav Kv1aVt" style="block-size: 559px; bottom: 0px; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 452.5px 279.5px; position: absolute; right: 0px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
<div id="bgMedia_comp-irt9hbxb" data-motion-part="BG_MEDIA comp-irt9hbxb" class="VgO9Yg" style="block-size: 559px; height: 559px; inline-size: 905px; perspective-origin: 452.5px 279.5px; transform-origin: 452.5px 279.5px; width: 905px;">
<wow-image id="img_comp-irt9hbxb" class="HlRz5e Kv1aVt dLPlxY mNGsUM bgImage" data-image-info="{&quot;containerId&quot;:&quot;comp-irt9hbxb&quot;,&quot;alignType&quot;:&quot;center&quot;,&quot;displayMode&quot;:&quot;fill&quot;,&quot;targetWidth&quot;:905,&quot;targetHeight&quot;:559,&quot;isLQIP&quot;:true,&quot;encoding&quot;:&quot;AVIF&quot;,&quot;imageData&quot;:{&quot;width&quot;:930,&quot;height&quot;:611,&quot;uri&quot;:&quot;d0220c_fc555432fc9542e994e1645024f3ebe1~mv2.png&quot;,&quot;name&quot;:&quot;&quot;,&quot;displayMode&quot;:&quot;fill&quot;}}" data-motion-part="BG_IMG comp-irt9hbxb" data-bg-effect-name="" data-has-ssr-src="true" style="block-size: 559px; bottom: 0px; display: block; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 452.5px 279.5px; position: absolute; right: 0px; top: 0px; transform: matrix(1, 0, 0, 1, 0, 0); transform-origin: 452.5px 279.5px; transition-property: transform; width: 905px;">
<img src="assets/d0220c_fc555432fc9542e994e1645024f3ebe1~mv2.png" alt="" style="width: 905px; height: 559px; object-fit: cover; object-position: 50% 50%;; block-size: 559px; height: 559px; inline-size: 905px; max-inline-size: 100%; max-width: 100%; object-fit: cover; perspective-origin: 452.5px 279.5px; transform-origin: 452.5px 279.5px; width: 905px;" width="905" height="559" data-ssr-src-done="true" fetchpriority="high">
</wow-image>
</div>
</div>
<div class="wfm0FO" style="block-size: 559px; border: solid 1px rgb(255, 255, 255); bottom: 0px; height: 559px; inline-size: 905px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 452.5px 279.5px; pointer-events: none; position: absolute; right: 0px; top: 0px; transform-origin: 452.5px 279.5px; width: 905px;">
</div>
<div data-mesh-id="comp-irt9hbxbinlineContent" data-testid="inline-content" class="" style="block-size: 559px; height: 559px; inline-size: 905px; min-block-size: 559px; min-height: 559px; perspective-origin: 452.5px 279.5px; pointer-events: none; transform-origin: 452.5px 279.5px; width: 905px;">
<div data-mesh-id="comp-irt9hbxbinlineContent-gridContainer" data-testid="mesh-container-content" style="inline-size: 905px; perspective-origin: 452.5px 0px; pointer-events: none; transform-origin: 452.5px 0px; width: 905px;">
</div>
</div>
</div>
<!--/$-->
</div>
</div>
<!--/$-->
</div>
</div>
</div>
<!--/$-->
</div>
</section>
<!--/$-->
</div>
</div>
</section>




<section id="comp-lt8qhfaf" tabindex="-1" class="Oqnisf comp-lt8qhfaf wixui-section" data-block-level-container="ClassicSection" style="align-self: start; block-size: 421px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 967.5px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 210.5px" wig-id="{{wigoh-id-006}}">
<div id="bgLayers_comp-lt8qhfaf" data-hook="bgLayers" data-motion-part="BG_LAYER comp-lt8qhfaf" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 421px; bottom: 0px; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 210.5px; position: absolute; right: 0px; top: 0px; transform-origin: 967.5px 210.5px">
</div>
<div data-mesh-id="comp-lt8qhfafinlineContent" data-testid="inline-content" class="" style="block-size: 421px; bottom: 0px; display: flex; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 967.5px 210.5px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 210.5px">
<div data-mesh-id="comp-lt8qhfafinlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 422px; display: grid; grid-template-columns: 1935px; grid-template-rows: 422px; height: 422px; margin-block-end: -1px; margin-bottom: -1px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 967.5px 211px; pointer-events: none; transform-origin: 967.5px 211px"><!--$-->
<section id="comp-irqduxcp" class="comp-irqduxcp CohWsy wixui-column-strip" style="align-self: start; block-size: 421px; bottom: 0px; display: flex; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; margin-block-start: 1px; margin-top: 1px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 967.5px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 210.5px">
<div id="bgLayers_comp-irqduxcp" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxcp" class="if7Vw2 tcElKx i1tH8h wG8dni" style="block-size: 421px; bottom: 0px; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 210.5px; position: absolute; right: 0px; top: 0px; transform-origin: 967.5px 210.5px; background-color: rgb(255, 255, 255);">
</div>
<div data-testid="columns" class="V5AUxf" style="block-size: 421px; bottom: 0px; column-gap: 0px; display: flex; height: 421px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 967.5px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 210.5px"><!--$-->
<div id="comp-irqduxcu" class="comp-irqduxcu YzqVVZ wixui-column-strip__column" style="block-size: 421px; bottom: 0px; flex-basis: 0%; flex-grow: 325; height: 421px; inline-size: 641.711px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 320.852px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 320.855px 210.5px; width: 641.711px">
<div id="bgLayers_comp-irqduxcu" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxcu" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 421px; bottom: 0px; height: 421px; inline-size: 641.711px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 320.852px 210.5px; position: absolute; right: 0px; top: 0px; transform-origin: 320.855px 210.5px; width: 641.711px; background-color: rgb(255, 255, 255);">
</div>
<div data-mesh-id="comp-irqduxcuinlineContent" data-testid="inline-content" style="block-size: 421px; bottom: 0px; height: 421px; inline-size: 641.711px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 320.852px 210.5px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 320.855px 210.5px; width: 641.711px; display: grid; grid-template-columns: 641.711px; grid-template-rows: 150px 42.5px 228.5px; height: 421px; min-block-size: 421px; min-height: 421px;"><!--$-->
<div id="comp-isejheta" class="comp-isejheta wixui-vector-image" style="align-self: start; block-size: 48px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 48px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -143px; inset-inline-start: 143px; justify-self: start; left: 143px; margin-block-end: 21px; margin-block-start: 81px; margin-bottom: 21px; margin-inline-start: 158.352px; margin-left: 158.352px; margin-top: 81px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 25px 24px; position: relative; right: -143px; top: 0px; transform-origin: 25px 24px; width: 50px">
<div data-testid="svgRoot-comp-isejheta" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isejheta" style="block-size: 48px; bottom: 0px; fill: rgb(133, 77, 255); height: 48px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 25px 24px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 25px 24px; width: 50px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true"><g><path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3 S141.4,88.3,149.8,80z"></path><path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3 S57.6,111.7,49.2,120z"></path><path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3 L149.8,120z"></path><path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12 z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxd4" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxd4 wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 23.5px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 23.5px; inline-size: 193px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -72px; inset-inline-start: 72px; justify-self: start; left: 72px; margin-block-end: 19px; margin-bottom: 19px; margin-inline-start: 158.352px; margin-left: 158.352px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 96.5px 11.75px; pointer-events: none; position: relative; right: -72px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 96.5px 11.75px; width: 193px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h5 class="font_5 wixui-rich-text__text" style="text-align: center; font-size: 20px; block-size: 23.5px; border-block-end-color: rgb(89, 51, 170); border-block-start-color: rgb(89, 51, 170); border-bottom-color: rgb(89, 51, 170); border-inline-end-color: rgb(89, 51, 170); border-inline-start-color: rgb(89, 51, 170); border-left-color: rgb(89, 51, 170); border-right-color: rgb(89, 51, 170); border-top-color: rgb(89, 51, 170); caret-color: rgb(89, 51, 170); color: rgb(89, 51, 170); column-rule-color: rgb(89, 51, 170); font-family: raleway, sans-serif; height: 23.5px; inline-size: 193px; outline-color: rgb(89, 51, 170); overflow-wrap: break-word; perspective-origin: 96.5px 11.75px; text-decoration: none solid rgb(89, 51, 170); text-decoration-color: rgb(89, 51, 170); text-emphasis-color: rgb(89, 51, 170); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 96.5px 11.75px; width: 193px; -webkit-text-fill-color: rgb(89, 51, 170); -webkit-text-stroke-color: rgb(89, 51, 170)">Our Story
</h5>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxcy" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxcy wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 108.812px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 108.812px; inline-size: 288px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -23px; inset-inline-start: 23px; justify-self: start; left: 23px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 158.352px; margin-left: 158.352px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 144px 54.4062px; pointer-events: none; position: relative; right: -23px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 144px 54.4062px; width: 288px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<p class="font_8 wixui-rich-text__text" style="line-height: 27.2px; text-align: center; font-size: 16px; block-size: 108.812px; border-block-end-color: rgb(96, 94, 94); border-block-start-color: rgb(96, 94, 94); border-bottom-color: rgb(96, 94, 94); border-inline-end-color: rgb(96, 94, 94); border-inline-start-color: rgb(96, 94, 94); border-left-color: rgb(96, 94, 94); border-right-color: rgb(96, 94, 94); border-top-color: rgb(96, 94, 94); caret-color: rgb(96, 94, 94); color: rgb(96, 94, 94); column-rule-color: rgb(96, 94, 94); font-family: raleway, sans-serif; height: 108.812px; inline-size: 288px; outline-color: rgb(96, 94, 94); overflow-wrap: break-word; perspective-origin: 144px 54.4062px; text-decoration: none solid rgb(96, 94, 94); text-decoration-color: rgb(96, 94, 94); text-emphasis-color: rgb(96, 94, 94); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 144px 54.4062px; width: 288px; -webkit-text-fill-color: rgb(96, 94, 94); -webkit-text-stroke-color: rgb(96, 94, 94)">I'm a paragraph. Click here to add your own text and edit me. I’m a great place for you to tell a story and let your users know a little more about you.
</p>
</div>
</div><!--/$-->
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxdj" class="comp-irqduxdj YzqVVZ wixui-column-strip__column" style="block-size: 421px; bottom: 0px; flex-basis: 0%; flex-grow: 324; height: 421px; inline-size: 639.734px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 319.867px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 319.867px 210.5px; width: 639.734px">
<div id="bgLayers_comp-irqduxdj" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxdj" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 421px; bottom: 0px; height: 421px; inline-size: 639.734px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 319.867px 210.5px; position: absolute; right: 0px; top: 0px; transform-origin: 319.867px 210.5px; width: 639.734px; background-color: rgb(255, 255, 255);">
</div>
<div data-mesh-id="comp-irqduxdjinlineContent" data-testid="inline-content" style="block-size: 421px; bottom: 0px; height: 421px; inline-size: 639.734px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 319.867px 210.5px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 319.867px 210.5px; width: 639.734px; display: grid; grid-template-columns: 639.734px; grid-template-rows: 137px 42.5px 241.5px; height: 421px; min-block-size: 421px; min-height: 421px;"><!--$-->
<div id="comp-isei1r55" class="comp-isei1r55 wixui-vector-image" style="align-self: start; block-size: 56px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 56px; inline-size: 48px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -137px; inset-inline-start: 137px; justify-self: start; left: 137px; margin-block-end: 16px; margin-block-start: 65px; margin-bottom: 16px; margin-inline-start: 157.867px; margin-left: 157.867px; margin-top: 65px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 24px 28px; position: relative; right: -137px; top: 0px; transform-origin: 24px 28px; width: 48px">
<div data-testid="svgRoot-comp-isei1r55" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isei1r55" style="block-size: 56px; bottom: 0px; fill: rgb(133, 77, 255); height: 56px; inline-size: 48px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 24px 28px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 24px 28px; width: 48px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.1 5.1 189.8 189.8" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.1 5.1 189.8 189.8" role="presentation" aria-hidden="true"><g><path class="st0" d="M100,5.1C47.6,5.1,5.1,47.6,5.1,100c0,52.4,42.5,94.9,94.9,94.9c52.4,0,94.9-42.5,94.9-94.9 C194.9,47.6,152.4,5.1,100,5.1z M100,160.4c-33.3,0-60.4-27-60.4-60.4c0-33.3,27-60.4,60.4-60.4c33.3,0,60.4,27,60.4,60.4 C160.4,133.3,133.3,160.4,100,160.4z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxds" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxds wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 23.5px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 23.5px; inline-size: 200px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -62px; inset-inline-start: 62px; justify-self: start; left: 62px; margin-block-end: 19px; margin-bottom: 19px; margin-inline-start: 157.867px; margin-left: 157.867px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 100px 11.75px; pointer-events: none; position: relative; right: -62px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 100px 11.75px; width: 200px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h5 class="font_5 wixui-rich-text__text" style="text-align: center; font-size: 20px; block-size: 23.5px; border-block-end-color: rgb(89, 51, 170); border-block-start-color: rgb(89, 51, 170); border-bottom-color: rgb(89, 51, 170); border-inline-end-color: rgb(89, 51, 170); border-inline-start-color: rgb(89, 51, 170); border-left-color: rgb(89, 51, 170); border-right-color: rgb(89, 51, 170); border-top-color: rgb(89, 51, 170); caret-color: rgb(89, 51, 170); color: rgb(89, 51, 170); column-rule-color: rgb(89, 51, 170); font-family: raleway, sans-serif; height: 23.5px; inline-size: 200px; outline-color: rgb(89, 51, 170); overflow-wrap: break-word; perspective-origin: 100px 11.75px; text-decoration: none solid rgb(89, 51, 170); text-decoration-color: rgb(89, 51, 170); text-emphasis-color: rgb(89, 51, 170); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 100px 11.75px; width: 200px; -webkit-text-fill-color: rgb(89, 51, 170); -webkit-text-stroke-color: rgb(89, 51, 170)">Our Vision
</h5>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxdn" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxdn wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 108.812px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 108.812px; inline-size: 288px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -16px; inset-inline-start: 16px; justify-self: start; left: 16px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 157.867px; margin-left: 157.867px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 144px 54.4062px; pointer-events: none; position: relative; right: -16px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 144px 54.4062px; width: 288px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<p class="font_8 wixui-rich-text__text" style="line-height: 27.2px; text-align: center; font-size: 16px; block-size: 108.812px; border-block-end-color: rgb(96, 94, 94); border-block-start-color: rgb(96, 94, 94); border-bottom-color: rgb(96, 94, 94); border-inline-end-color: rgb(96, 94, 94); border-inline-start-color: rgb(96, 94, 94); border-left-color: rgb(96, 94, 94); border-right-color: rgb(96, 94, 94); border-top-color: rgb(96, 94, 94); caret-color: rgb(96, 94, 94); color: rgb(96, 94, 94); column-rule-color: rgb(96, 94, 94); font-family: raleway, sans-serif; height: 108.812px; inline-size: 288px; outline-color: rgb(96, 94, 94); overflow-wrap: break-word; perspective-origin: 144px 54.4062px; text-decoration: none solid rgb(96, 94, 94); text-decoration-color: rgb(96, 94, 94); text-emphasis-color: rgb(96, 94, 94); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 144px 54.4062px; width: 288px; -webkit-text-fill-color: rgb(96, 94, 94); -webkit-text-stroke-color: rgb(96, 94, 94)">I'm a paragraph. Click here to add your own text and edit me. I’m a great place for you to tell a story and let your users know a little more about you.
</p>
</div>
</div><!--/$-->
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxdz" class="comp-irqduxdz YzqVVZ wixui-column-strip__column" style="block-size: 421px; bottom: 0px; flex-basis: 0%; flex-grow: 331; height: 421px; inline-size: 653.555px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 326.773px 210.5px; position: relative; right: 0px; top: 0px; transform-origin: 326.777px 210.5px; width: 653.555px">
<div id="bgLayers_comp-irqduxdz" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxdz" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="background-color: rgb(255, 255, 255); block-size: 421px; bottom: 0px; height: 421px; inline-size: 653.555px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 326.773px 210.5px; position: absolute; right: 0px; top: 0px; transform-origin: 326.777px 210.5px; width: 653.555px">
</div>
<div data-mesh-id="comp-irqduxdzinlineContent" data-testid="inline-content" style="block-size: 421px; bottom: 0px; height: 421px; inline-size: 653.555px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 326.773px 210.5px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 326.777px 210.5px; width: 653.555px; display: grid; grid-template-columns: 653.555px; grid-template-rows: 136px 42.5px 242.5px; min-block-size: 421px; min-height: 421px;"><!--$-->
<div id="comp-isejuitl" class="comp-isejuitl wixui-vector-image" style="align-self: start; block-size: 55px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 55px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -141px; inset-inline-start: 141px; justify-self: start; left: 141px; margin-block-end: 16px; margin-block-start: 65px; margin-bottom: 16px; margin-inline-start: 161.273px; margin-left: 161.273px; margin-top: 65px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 25px 27.5px; position: relative; right: -141px; top: 0px; transform-origin: 25px 27.5px; width: 50px">
<div data-testid="svgRoot-comp-isejuitl" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isejuitl" style="block-size: 55px; bottom: 0px; fill: rgb(133, 77, 255); height: 55px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 25px 27.5px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 25px 27.5px; width: 50px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="1 1 198 198" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="1 1 198 198" role="presentation" aria-hidden="true"><g><path class="st0" d="M181.9,83H117V18.1C117,8.7,109.4,1,100,1c-9.4,0-17,7.7-17,17.1V83H18.1C8.7,83,1,90.6,1,100 c0,9.4,7.7,17,17.1,17H83v64.9c0,9.4,7.6,17.1,17,17.1c9.4,0,17-7.7,17-17.1V117h64.9c9.4,0,17.1-7.6,17.1-17 C199,90.6,191.3,83,181.9,83z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxeb" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxeb wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 23.5px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 23.5px; inline-size: 185px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -74px; inset-inline-start: 74px; justify-self: start; left: 74px; margin-block-end: 19px; margin-bottom: 19px; margin-inline-start: 161.273px; margin-left: 161.273px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 92.5px 11.75px; pointer-events: none; position: relative; right: -74px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 92.5px 11.75px; width: 185px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h5 class="font_5 wixui-rich-text__text" style="text-align: center; font-size: 20px; block-size: 23.5px; border-block-end-color: rgb(89, 51, 170); border-block-start-color: rgb(89, 51, 170); border-bottom-color: rgb(89, 51, 170); border-inline-end-color: rgb(89, 51, 170); border-inline-start-color: rgb(89, 51, 170); border-left-color: rgb(89, 51, 170); border-right-color: rgb(89, 51, 170); border-top-color: rgb(89, 51, 170); caret-color: rgb(89, 51, 170); color: rgb(89, 51, 170); column-rule-color: rgb(89, 51, 170); font-family: raleway, sans-serif; height: 23.5px; inline-size: 185px; outline-color: rgb(89, 51, 170); overflow-wrap: break-word; perspective-origin: 92.5px 11.75px; text-decoration: none solid rgb(89, 51, 170); text-decoration-color: rgb(89, 51, 170); text-emphasis-color: rgb(89, 51, 170); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 92.5px 11.75px; width: 185px; -webkit-text-fill-color: rgb(89, 51, 170); -webkit-text-stroke-color: rgb(89, 51, 170)">Technology
</h5>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxe2" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxe2 wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 108.812px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 108.812px; inline-size: 288px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -21px; inset-inline-start: 21px; justify-self: start; left: 21px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 161.273px; margin-left: 161.273px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 144px 54.4062px; pointer-events: none; position: relative; right: -21px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 144px 54.4062px; width: 288px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<p class="font_8 wixui-rich-text__text" style="line-height: 27.2px; text-align: center; font-size: 16px; block-size: 108.812px; border-block-end-color: rgb(96, 94, 94); border-block-start-color: rgb(96, 94, 94); border-bottom-color: rgb(96, 94, 94); border-inline-end-color: rgb(96, 94, 94); border-inline-start-color: rgb(96, 94, 94); border-left-color: rgb(96, 94, 94); border-right-color: rgb(96, 94, 94); border-top-color: rgb(96, 94, 94); caret-color: rgb(96, 94, 94); color: rgb(96, 94, 94); column-rule-color: rgb(96, 94, 94); font-family: raleway, sans-serif; height: 108.812px; inline-size: 288px; outline-color: rgb(96, 94, 94); overflow-wrap: break-word; perspective-origin: 144px 54.4062px; text-decoration: none solid rgb(96, 94, 94); text-decoration-color: rgb(96, 94, 94); text-emphasis-color: rgb(96, 94, 94); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 144px 54.4062px; width: 288px; -webkit-text-fill-color: rgb(96, 94, 94); -webkit-text-stroke-color: rgb(96, 94, 94)">I'm a paragraph. Click here to add your own text and edit me. I’m a great place for you to tell a story and let your users know a little more about you.
</p>
</div>
</div><!--/$-->
</div>
</div><!--/$-->
</div>
</section><!--/$-->
<div id="comp-irte5pmq" class="flex-element widget-wrapper Vd6aQZ ignore-focus comp-irte5pmq" role="region" tabindex="-1" aria-label="Who are we" style="align-self: start; block-size: 90px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 90px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: stretch; left: 0px; margin-block-end: 10px; margin-bottom: 10px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 45px; pointer-events: none; position: relative; right: 0px; text-wrap-mode: nowrap; transform-origin: 967.5px 45px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<div id="whoarewe" style="pointer-events: none; text-wrap-mode: nowrap">
</div><span class="mHZSwn" style="display: none; perspective-origin: 50% 50%; pointer-events: none; text-wrap-mode: nowrap; transform-origin: 50% 50%">Who are we</span>
</div>
</div>
</div>
</div>
</section>


<section id="comp-lt8qhfaf1" tabindex="-1" class="Oqnisf comp-lt8qhfaf1 wixui-section" data-block-level-container="ClassicSection" style="align-self: start; block-size: 1218px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 967.5px 609px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px" wig-id="{{wigoh-id-007}}">
<div id="bgLayers_comp-lt8qhfaf1" data-hook="bgLayers" data-motion-part="BG_LAYER comp-lt8qhfaf1" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 1218px; bottom: 0px; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 609px; position: absolute; right: 0px; top: 0px; transform-origin: 967.5px 609px">
</div>
<div data-mesh-id="comp-lt8qhfaf1inlineContent" data-testid="inline-content" class="" style="block-size: 1218px; bottom: 0px; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 967.5px 609px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px">
<div data-mesh-id="comp-lt8qhfaf1inlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 1218px; display: grid; grid-template-columns: 1935px; grid-template-rows: 1218px; height: 1218px; perspective-origin: 967.5px 609px; pointer-events: none; transform-origin: 967.5px 609px"><!--$-->
<section id="comp-irqduxas" class="comp-irqduxas CohWsy wixui-column-strip" style="align-self: start; block-size: 1218px; bottom: 0px; display: flex; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: start; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: 980px; min-width: 980px; perspective-origin: 967.5px 609px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px">
<div id="bgLayers_comp-irqduxas" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxas" class="if7Vw2 tcElKx i1tH8h wG8dni" style="block-size: 1218px; bottom: 0px; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 609px; position: absolute; right: 0px; top: 0px; transform-origin: 967.5px 609px;">
</div>
<div data-testid="columns" class="V5AUxf" style="block-size: 1218px; bottom: 0px; column-gap: 0px; display: flex; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 967.5px 609px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px"><!--$-->
<div id="comp-irqduxaw" class="comp-irqduxaw YzqVVZ wixui-column-strip__column" style="block-size: 1218px; bottom: 0px; flex-basis: 0%; flex-grow: 980; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; min-block-size: auto; min-height: auto; perspective-origin: 967.5px 609px; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px">
<div id="bgLayers_comp-irqduxaw" data-hook="bgLayers" data-motion-part="BG_LAYER comp-irqduxaw" class="MW5IWV LWbAav Kv1aVt VgO9Yg" style="block-size: 1218px; bottom: 0px; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; mask-position: 0px 50%; mask-repeat: no-repeat; mask-size: 100%; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 609px; position: absolute; right: 0px; top: 0px; transform-origin: 967.5px 609px; background-color: rgb(242, 247, 255);">
</div>
<div data-mesh-id="comp-irqduxawinlineContent" data-testid="inline-content" class="" style="block-size: 1218px; bottom: 0px; height: 1218px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 967.5px 609px; pointer-events: none; position: relative; right: 0px; top: 0px; transform-origin: 967.5px 609px">
<div data-mesh-id="comp-irqduxawinlineContent-gridContainer" data-testid="mesh-container-content" style="block-size: 1218px; display: grid; grid-template-columns: 1935px; grid-template-rows: 199px 50px 30px 61px 45px 0px 198px 0px 0px 106px 32px 44px 62px 234px 157px; height: 1218px; min-block-size: 1218px; min-height: 1218px; perspective-origin: 967.5px 609px; pointer-events: none; transform-origin: 967.5px 609px"><!--$-->
<div id="comp-irtb3bz7" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irtb3bz7 wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 47px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 47px; inline-size: 746px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -115px; inset-inline-start: 115px; justify-self: start; left: 115px; margin-block-end: 35px; margin-block-start: 117px; margin-bottom: 35px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 117px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 373px 23.5px; pointer-events: none; position: relative; right: -115px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 373px 23.5px; width: 746px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h4 class="font_4 wixui-rich-text__text" style="text-align: center; font-size: 40px; block-size: 47px; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; height: 47px; inline-size: 746px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; perspective-origin: 373px 23.5px; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 373px 23.5px; width: 746px; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46)">How it works
</h4>
</div>
</div><!--/$--><!--$-->
<div id="comp-irsxtu2g" class="comp-irsxtu2g wixui-vector-image" style="align-self: start; block-size: 24px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 3; grid-row-start: 2; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -35px; inset-inline-start: 35px; justify-self: start; left: 35px; margin-block-end: 26px; margin-bottom: 26px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 12px 12px; position: relative; right: -35px; top: 0px; transform-origin: 12px 12px; width: 24px">
<div data-testid="svgRoot-comp-irsxtu2g" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-irsxtu2g" style="block-size: 24px; bottom: 0px; fill: rgb(235, 254, 255); fill-opacity: 0.5; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 12px 12px; position: absolute; right: 0px; stroke: rgb(255, 255, 255); stroke-opacity: 0; top: 0px; transform-origin: 12px 12px; width: 24px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="1.9 1.9 56.2 56.2" xmlns="http://www.w3.org/2000/svg" viewBox="1.9 1.9 56.2 56.2" role="presentation" aria-hidden="true"><g><path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irsxtr31" class="comp-irsxtr31 wixui-vector-image" style="align-self: start; block-size: 24px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 4; grid-row-start: 3; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -20px; inset-inline-start: 20px; justify-self: start; left: 20px; margin-block-end: 6px; margin-bottom: 6px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 12px 12px; position: relative; right: -20px; top: 0px; transform-origin: 12px 12px; width: 24px">
<div data-testid="svgRoot-comp-irsxtr31" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-irsxtr31" style="block-size: 24px; bottom: 0px; fill: rgb(235, 254, 255); fill-opacity: 0.5; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 12px 12px; position: absolute; right: 0px; stroke: rgb(255, 255, 255); stroke-opacity: 0; top: 0px; transform-origin: 12px 12px; width: 24px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="1.9 1.9 56.2 56.2" xmlns="http://www.w3.org/2000/svg" viewBox="1.9 1.9 56.2 56.2" role="presentation" aria-hidden="true"><g><path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irsxsok1" class="comp-irsxsok1 wixui-vector-image" style="align-self: start; block-size: 24px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 5; grid-row-start: 4; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -42px; inset-inline-start: 42px; justify-self: start; left: 42px; margin-block-end: 24px; margin-block-start: 13px; margin-bottom: 24px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 13px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 12px 12px; position: relative; right: -42px; top: 0px; transform-origin: 12px 12px; width: 24px">
<div data-testid="svgRoot-comp-irsxsok1" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-irsxsok1" style="block-size: 24px; bottom: 0px; fill: rgb(235, 254, 255); fill-opacity: 0.5; height: 24px; inline-size: 24px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 12px 12px; position: absolute; right: 0px; stroke: rgb(255, 255, 255); stroke-opacity: 0; top: 0px; transform-origin: 12px 12px; width: 24px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="1.9 1.9 56.2 56.2" xmlns="http://www.w3.org/2000/svg" viewBox="1.9 1.9 56.2 56.2" role="presentation" aria-hidden="true"><g><path d="M30 1.9C14.5 1.9 1.9 14.5 1.9 30c0 15.5 12.6 28.1 28.1 28.1S58.1 45.5 58.1 30C58.1 14.5 45.5 1.9 30 1.9zm0 44c-8.8 0-15.9-7.1-15.9-15.9S21.2 14.1 30 14.1 45.9 21.2 45.9 30 38.8 45.9 30 45.9z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-iruwiqnd" class="MazNVa comp-iruwiqnd wixui-image" style="align-self: start; block-size: 188px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 7; grid-row-start: 3; height: 188px; inline-size: 239px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -115px; inset-inline-start: 115px; justify-self: start; left: 115px; margin-block-end: -62px; margin-block-start: 10px; margin-bottom: -62px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 10px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 119.5px 94px; position: relative; right: -115px; top: 0px; transform-origin: 119.5px 94px; width: 239px">
<div data-testid="linkElement" class="flex-element widget-wrapper j7pOnl" style="block-size: 188px; box-sizing: border-box; height: 188px; inline-size: 239px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 119.5px 94px; transform-origin: 119.5px 94px; width: 239px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><wow-image id="img_comp-iruwiqnd" class="jhxvbR BI8PVQ" data-image-info="{" containerid":"comp-iruwiqnd","displaymode":"fill","targetwidth":239,"targetheight":188,"islqip":true,"encoding":"avif","imagedata":{"width":238,"height":187,"uri":"d0220c_a7f38a088979498b9254e7a1c6ccac1d~mv2.png","name":"","displaymode":"fill"}}"="" data-motion-part="BG_IMG comp-iruwiqnd" data-bg-effect-name="" data-has-ssr-src="true" style="block-size: 188px; display: block; height: 188px; inline-size: 239px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 119.5px 94px; transform-origin: 119.5px 94px; width: 239px"><img src="assets/d0220c_a7f38a088979498b9254e7a1c6ccac1d~mv2.png" alt="" style="width: 239px; height: 188px; object-fit: cover; object-position: 50% 50%;" width="239" height="188" loading="lazy" data-ssr-src-done="true" fetchpriority="high"></wow-image>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-iruwjbi6" class="MazNVa comp-iruwjbi6 wixui-image" style="align-self: start; block-size: 188px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 8; grid-row-start: 7; height: 188px; inline-size: 239px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -267px; inset-inline-start: 267px; justify-self: start; left: 267px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 119.5px 94px; position: relative; right: -267px; top: 0px; transform-origin: 119.5px 94px; width: 239px">
<div data-testid="linkElement" class="flex-element widget-wrapper j7pOnl" style="block-size: 188px; box-sizing: border-box; height: 188px; inline-size: 239px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 119.5px 94px; transform-origin: 119.5px 94px; width: 239px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><wow-image id="img_comp-iruwjbi6" class="jhxvbR BI8PVQ" data-image-info="{" containerid":"comp-iruwjbi6","displaymode":"fill","targetwidth":239,"targetheight":188,"islqip":true,"encoding":"avif","imagedata":{"width":238,"height":187,"uri":"d0220c_6140a2819d134cc28245da959cd2336b~mv2.png","name":"","displaymode":"fill"}}"="" data-motion-part="BG_IMG comp-iruwjbi6" data-bg-effect-name="" data-has-ssr-src="true" style="block-size: 188px; display: block; height: 188px; inline-size: 239px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 119.5px 94px; transform-origin: 119.5px 94px; width: 239px"><img src="assets/d0220c_6140a2819d134cc28245da959cd2336b~mv2.png" alt="" style="width: 239px; height: 188px; object-fit: cover; object-position: 50% 50%;" width="239" height="188" loading="lazy" data-ssr-src-done="true" fetchpriority="high"></wow-image>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-isejjlss" class="comp-isejjlss wixui-vector-image" style="align-self: start; block-size: 26px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 6; grid-row-start: 5; height: 26px; inline-size: 29px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -372px; inset-inline-start: 372px; justify-self: start; left: 372px; margin-block-end: 18px; margin-block-start: 1px; margin-bottom: 18px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 1px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 14.5px 13px; position: relative; right: -372px; top: 0px; transform-origin: 14.5px 13px; width: 29px">
<div data-testid="svgRoot-comp-isejjlss" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isejjlss" style="block-size: 26px; bottom: 0px; fill: rgb(133, 77, 255); height: 26px; inline-size: 29px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 14.5px 13px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 14.5px 13px; width: 29px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true"><g><path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3 S141.4,88.3,149.8,80z"></path><path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3 S57.6,111.7,49.2,120z"></path><path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3 L149.8,120z"></path><path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12 z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-isehzfd9" class="comp-isehzfd9 wixui-vector-image" style="align-self: start; block-size: 54px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 8; grid-row-start: 7; height: 54px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -197px; inset-inline-start: 197px; justify-self: start; left: 197px; margin-block-end: 10px; margin-block-start: 86px; margin-bottom: 10px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 86px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 25px 27px; position: relative; right: -197px; top: 0px; transform-origin: 25px 27px; width: 50px">
<div data-testid="svgRoot-comp-isehzfd9" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isehzfd9" style="block-size: 54px; bottom: 0px; fill: rgb(133, 77, 255); height: 54px; inline-size: 50px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 25px 27px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 25px 27px; width: 50px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="2.075 2.275 195.95 195.588" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="2.075 2.275 195.95 195.588" role="presentation" aria-hidden="true"><g><path class="st0" d="M188.5,11.8c-12.7-12.7-33.4-12.7-46.2,0c-10.1,10.1-12.2,25.3-6.2,37.5L49.4,136c-12.2-6.2-27.6-4.2-37.8,6.1 c-12.7,12.7-12.7,33.4,0,46.2s33.4,12.7,46.2,0c10.2-10.2,12.2-25.6,6-37.9l86.5-86.5c12.3,6.4,27.8,4.5,38.2-5.9 C201.2,45.2,201.2,24.6,188.5,11.8z M43.4,173.8c-4.8,4.8-12.6,4.8-17.4,0c-4.8-4.8-4.8-12.6,0-17.4c4.8-4.8,12.6-4.8,17.4,0 C48.3,161.2,48.3,169,43.4,173.8z M174.1,43.6c-4.8,4.8-12.6,4.8-17.4,0c-4.8-4.8-4.8-12.6,0-17.4c4.8-4.8,12.6-4.8,17.4,0 C178.9,31,178.9,38.8,174.1,43.6z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxb1" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxb1 wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 47px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 5; grid-row-start: 4; height: 47px; inline-size: 304px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -558px; inset-inline-start: 558px; justify-self: start; left: 558px; margin-block-end: 14px; margin-bottom: 14px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 152px 23.5px; pointer-events: none; position: relative; right: -558px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 152px 23.5px; width: 304px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h4 class="font_4 wixui-rich-text__text" style="font-size: 40px; block-size: 47px; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; height: 47px; inline-size: 304px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; perspective-origin: 152px 23.5px; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 152px 23.5px; width: 304px; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46)">Smart
</h4>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxb4" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxb4 wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 224px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 10; grid-row-start: 5; height: 224px; inline-size: 290px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -558px; inset-inline-start: 558px; justify-self: start; left: 558px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 145px 112px; pointer-events: none; position: relative; right: -558px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 145px 112px; width: 290px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<p class="font_8 wixui-rich-text__text" style="line-height: 32px; font-size: 16px; block-size: 224px; border-block-end-color: rgb(96, 94, 94); border-block-start-color: rgb(96, 94, 94); border-bottom-color: rgb(96, 94, 94); border-inline-end-color: rgb(96, 94, 94); border-inline-start-color: rgb(96, 94, 94); border-left-color: rgb(96, 94, 94); border-right-color: rgb(96, 94, 94); border-top-color: rgb(96, 94, 94); caret-color: rgb(96, 94, 94); color: rgb(96, 94, 94); column-rule-color: rgb(96, 94, 94); font-family: raleway, sans-serif; height: 224px; inline-size: 290px; outline-color: rgb(96, 94, 94); overflow-wrap: break-word; perspective-origin: 145px 112px; text-decoration: none solid rgb(96, 94, 94); text-decoration-color: rgb(96, 94, 94); text-emphasis-color: rgb(96, 94, 94); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 145px 112px; width: 290px; -webkit-text-fill-color: rgb(96, 94, 94); -webkit-text-stroke-color: rgb(96, 94, 94)">I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.
</p>
</div>
</div><!--/$--><!--$-->
<div id="comp-iruxih60" class="MazNVa comp-iruxih60 wixui-image" style="align-self: start; block-size: 32px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 12; grid-row-start: 11; height: 32px; inline-size: 35px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -526px; inset-inline-start: 526px; justify-self: start; left: 526px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 17.5px 16px; position: relative; right: -526px; top: 0px; transform-origin: 17.5px 16px; width: 35px">
<div data-testid="linkElement" class="flex-element widget-wrapper j7pOnl" style="block-size: 32px; box-sizing: border-box; height: 32px; inline-size: 35px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 17.5px 16px; transform-origin: 17.5px 16px; width: 35px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><wow-image id="img_comp-iruxih60" class="jhxvbR BI8PVQ" data-image-info="{" containerid":"comp-iruxih60","displaymode":"fill","targetwidth":35,"targetheight":32,"islqip":true,"encoding":"avif","imagedata":{"width":200,"height":200,"uri":"d0220c_4e64d7e1227d4327a88458c858facae7~mv2.png","name":"","displaymode":"fill"}}"="" data-motion-part="BG_IMG comp-iruxih60" data-bg-effect-name="" data-has-ssr-src="true" style="block-size: 32px; display: block; height: 32px; inline-size: 35px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 17.5px 16px; transform-origin: 17.5px 16px; width: 35px"><img src="assets/d0220c_4e64d7e1227d4327a88458c858facae7~mv2.png" alt="" style="width: 35px; height: 32px; object-fit: cover; object-position: 50% 50%;" width="35" height="32" loading="lazy" data-ssr-src-done="true" fetchpriority="high"></wow-image>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-irqduxbr" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irqduxbr wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 47px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 14; grid-row-start: 13; height: 47px; inline-size: 287px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -150px; inset-inline-start: 150px; justify-self: start; left: 150px; margin-block-end: 15px; margin-bottom: 15px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 143.5px 23.5px; pointer-events: none; position: relative; right: -150px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 143.5px 23.5px; width: 287px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<h4 class="font_4 wixui-rich-text__text" style="font-size: 40px; block-size: 47px; border-block-end-color: rgb(47, 46, 46); border-block-start-color: rgb(47, 46, 46); border-bottom-color: rgb(47, 46, 46); border-inline-end-color: rgb(47, 46, 46); border-inline-start-color: rgb(47, 46, 46); border-left-color: rgb(47, 46, 46); border-right-color: rgb(47, 46, 46); border-top-color: rgb(47, 46, 46); caret-color: rgb(47, 46, 46); color: rgb(47, 46, 46); column-rule-color: rgb(47, 46, 46); font-family: raleway, sans-serif; height: 47px; inline-size: 287px; outline-color: rgb(47, 46, 46); overflow-wrap: break-word; perspective-origin: 143.5px 23.5px; text-decoration: none solid rgb(47, 46, 46); text-decoration-color: rgb(47, 46, 46); text-emphasis-color: rgb(47, 46, 46); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 143.5px 23.5px; width: 287px; -webkit-text-fill-color: rgb(47, 46, 46); -webkit-text-stroke-color: rgb(47, 46, 46)">Fast
</h4>
</div>
</div><!--/$--><!--$-->
<div id="comp-irsw090n" class="flex-element widget-wrapper HcOXKn SxM0TO QxJLC3 lq2cno YQcXTT comp-irsw090n wixui-rich-text" data-testid="richTextElement" style="align-self: start; block-size: 224px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 15; grid-row-start: 14; height: 224px; inline-size: 287px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -150px; inset-inline-start: 150px; justify-self: start; left: 150px; margin-block-end: 10px; margin-bottom: 10px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-wrap: break-word; perspective-origin: 143.5px 112px; pointer-events: none; position: relative; right: -150px; text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; top: 0px; transform-origin: 143.5px 112px; width: 287px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<p class="font_8 wixui-rich-text__text" style="line-height: 32px; font-size: 16px; block-size: 224px; border-block-end-color: rgb(96, 94, 94); border-block-start-color: rgb(96, 94, 94); border-bottom-color: rgb(96, 94, 94); border-inline-end-color: rgb(96, 94, 94); border-inline-start-color: rgb(96, 94, 94); border-left-color: rgb(96, 94, 94); border-right-color: rgb(96, 94, 94); border-top-color: rgb(96, 94, 94); caret-color: rgb(96, 94, 94); color: rgb(96, 94, 94); column-rule-color: rgb(96, 94, 94); font-family: raleway, sans-serif; height: 224px; inline-size: 287px; outline-color: rgb(96, 94, 94); overflow-wrap: break-word; perspective-origin: 143.5px 112px; text-decoration: none solid rgb(96, 94, 94); text-decoration-color: rgb(96, 94, 94); text-emphasis-color: rgb(96, 94, 94); text-shadow: rgba(0, 0, 0, 0) 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px; text-size-adjust: 100%; transform-origin: 143.5px 112px; width: 287px; -webkit-text-fill-color: rgb(96, 94, 94); -webkit-text-stroke-color: rgb(96, 94, 94)">I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. I’m a great place for you to tell a story and let your users know a little more about you.
</p>
</div>
</div><!--/$--><!--$-->
<div id="comp-isejkuti" class="comp-isejkuti wixui-vector-image" style="align-self: start; block-size: 26px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 13; grid-row-start: 12; height: 26px; inline-size: 29px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -500px; inset-inline-start: 500px; justify-self: start; left: 500px; margin-block-end: 18px; margin-bottom: 18px; margin-inline-start: 477.5px; margin-left: 477.5px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 14.5px 13px; position: relative; right: -500px; top: 0px; transform-origin: 14.5px 13px; width: 29px">
<div data-testid="svgRoot-comp-isejkuti" class="flex-element widget-wrapper AKxYR5 VZYmYf comp-isejkuti" style="block-size: 26px; bottom: 0px; fill: rgb(133, 77, 255); height: 26px; inline-size: 29px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; left: 0px; perspective-origin: 14.5px 13px; position: absolute; right: 0px; stroke: rgb(0, 0, 0); stroke-opacity: 0; stroke-width: 0px; top: 0px; transform-origin: 14.5px 13px; width: 29px; -webkit-tap-highlight-color: rgba(0, 0, 0, 0)" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true"><g><path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3 S141.4,88.3,149.8,80z"></path><path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3 S57.6,111.7,49.2,120z"></path><path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3 L149.8,120z"></path><path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12 z"></path></g></svg>
</div>
</div>
</div><!--/$--><!--$-->
<div id="comp-iruxgy2h" class="MazNVa comp-iruxgy2h wixui-image" style="align-self: start; block-size: 338px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 16; grid-row-start: 12; height: 338px; inline-size: 318px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: -538px; inset-inline-start: 538px; justify-self: start; left: 538px; margin-block-end: 10px; margin-block-start: 10px; margin-bottom: 10px; margin-inline-start: 477.5px; margin-left: 477.5px; margin-top: 10px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 159px 169px; position: relative; right: -538px; top: 0px; transform-origin: 159px 169px; width: 318px">
<div data-testid="linkElement" class="flex-element widget-wrapper j7pOnl" style="block-size: 338px; box-sizing: border-box; height: 338px; inline-size: 318px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 159px 169px; transform-origin: 159px 169px; width: 318px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636"><wow-image id="img_comp-iruxgy2h" class="jhxvbR BI8PVQ" data-image-info="{" containerid":"comp-iruxgy2h","displaymode":"fill","targetwidth":318,"targetheight":338,"islqip":true,"encoding":"avif","imagedata":{"width":319,"height":337,"uri":"d0220c_e3bf6981882c401eb9faabbc11062691~mv2.png","name":"","displaymode":"fill"}}"="" data-motion-part="BG_IMG comp-iruxgy2h" data-bg-effect-name="" data-has-ssr-src="true" style="block-size: 338px; display: block; height: 338px; inline-size: 318px; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 159px 169px; transform-origin: 159px 169px; width: 318px"><img src="assets/d0220c_e3bf6981882c401eb9faabbc11062691~mv2.png" alt="" style="width: 318px; height: 338px; object-fit: cover; object-position: 50% 50%;" width="318" height="338" loading="lazy" data-ssr-src-done="true" fetchpriority="high"></wow-image>
</div>
</div>
</div><!--/$-->
<div data-mesh-id="comp-irqduxawinlineContent-wedge-11" style="block-size: 689px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 11; grid-row-start: 1; height: 689px; inline-size: 0px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; perspective-origin: 0px 344.5px; transform-origin: 0px 344.5px; visibility: hidden; width: 0px">
</div>
</div>
</div>
</div><!--/$-->
</div>
</section><!--/$-->
<div id="comp-irte6ovt" class="flex-element widget-wrapper Vd6aQZ ignore-focus comp-irte6ovt" role="region" tabindex="-1" aria-label="How it works" style="align-self: start; block-size: 90px; bottom: 0px; grid-column-end: 2; grid-column-start: 1; grid-row-end: 2; grid-row-start: 1; height: 90px; inset-block-end: 0px; inset-block-start: 0px; inset-inline-end: 0px; inset-inline-start: 0px; justify-self: stretch; left: 0px; margin-block-end: 10px; margin-bottom: 10px; min-block-size: auto; min-height: auto; min-inline-size: auto; min-width: auto; overflow-block: hidden; overflow-inline: hidden; overflow-x: hidden; overflow-y: hidden; perspective-origin: 967.5px 45px; pointer-events: none; position: relative; right: 0px; text-wrap-mode: nowrap; transform-origin: 967.5px 45px" data-auto="flex-element-widget-wrapper" data-widget-type="html">
<div dmle_widget="html" data-element-type="html" class="dmCustomHtml u_898997636">
<div id="howitworks" style="pointer-events: none; text-wrap-mode: nowrap">
</div><span class="mHZSwn" style="display: none; perspective-origin: 50% 50%; pointer-events: none; text-wrap-mode: nowrap; transform-origin: 50% 50%">How it works</span>
</div>
</div>
</div>
</div>
</section>


</section>
`;

export async function parseAboutHtmlPage(siteId = null) {
  try {
    // Use the static HTML content instead of making an API call
    const html = staticHtmlContent;
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Find the specific div with id="dm" and class="dmwr"
    // Note: The provided HTML doesn't have this div, so we'll look for the main section instead
    let targetElement = $('div#dm.dmwr');
    
    // If the dm div is not found, use the main section as fallback
    if (targetElement.length === 0) {
      targetElement = $('section').first(); // Get the first section element
    }
    
    if (targetElement.length === 0) {
      return {
        success: false,
        message: 'No target element found',
        dmDivFound: false,
        dmDivContent: null,
        dmDivHtml: null
      };
    }
    
    // Extract the element content and HTML
    const dmDivContent = targetElement.text().trim();
    const dmDivHtml = targetElement.html();
    const dmDivOuterHtml = $.html(targetElement);
    
    // Extract all elements with IDs from the target element for matching
    const elementsWithIds = extractElementsWithIds(targetElement, $);
    
    return {
      success: true,
      message: 'HTML parsed successfully',
      dmDivFound: true,
      dmDivContent,
      dmDivHtml,
      dmDivOuterHtml,
      elementsWithIds,
      dmDivAttributes: {
        id: targetElement.attr('id'),
        class: targetElement.attr('class'),
        allAttributes: targetElement.get(0)?.attribs || {}
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message,
      dmDivFound: false,
      dmDivContent: null,
      dmDivHtml: null,
      error: error.message
    };
  }
}

// Set HTML content function to allow updating the static HTML
export function setStaticHtmlContent(newHtml) {
  staticHtmlContent = newHtml;
}

// Helper function to extract specific elements from the parsed HTML
export function extractElementsFromHtml(html, selector) {
  try {
    const $ = cheerio.load(html);
    const elements = $(selector);
    
    const extractedElements = [];
    elements.each((index, element) => {
      const $element = $(element);
      extractedElements.push({
        index,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {}
      });
    });
    
    return {
      success: true,
      elements: extractedElements,
      count: elements.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      elements: [],
      count: 0
    };
  }
}

// Extract all elements with IDs from the target element
function extractElementsWithIds(targetElement, $) {
  const elementsWithIds = [];
  
  // Find all elements with ID attributes within the target element
  targetElement.find('[id]').each((index, element) => {
    const $element = $(element);
    const id = $element.attr('id');
    
    if (id) {
      elementsWithIds.push({
        id: id,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html()
      });
    }
  });
  
  // Also find elements with class attributes that might contain IDs
  targetElement.find('[class]').each((index, element) => {
    const $element = $(element);
    const className = $element.attr('class');
    
    if (className) {
      // Check if any class names look like IDs (containing hyphens and alphanumeric)
      const classArray = className.split(' ');
      classArray.forEach(cls => {
        if (cls.match(/^[a-zA-Z0-9\-_]+$/) && cls.length > 5) {
          elementsWithIds.push({
            id: cls,
            tagName: element.tagName,
            text: $element.text().trim(),
            html: $element.html(),
            outerHtml: $.html($element),
            attributes: element.attribs || {},
            hasInnerContent: !!$element.html(),
            sourceAttribute: 'class'
          });
        }
      });
    }
  });
  
  // Also find elements with data attributes that might contain IDs
  targetElement.find('[data-widget-id], [data-id]').each((index, element) => {
    const $element = $(element);
    const dataWidgetId = $element.attr('data-widget-id');
    const dataId = $element.attr('data-id');
    
    if (dataWidgetId) {
      elementsWithIds.push({
        id: dataWidgetId,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
        sourceAttribute: 'data-widget-id'
      });
    }
    
    if (dataId) {
      elementsWithIds.push({
        id: dataId,
        tagName: element.tagName,
        text: $element.text().trim(),
        html: $element.html(),
        outerHtml: $.html($element),
        attributes: element.attribs || {},
        hasInnerContent: !!$element.html(),
        sourceAttribute: 'data-id'
      });
    }
  });
  
  // Remove duplicates based on ID
  const uniqueElements = elementsWithIds.filter((element, index, self) =>
    index === self.findIndex(e => e.id === element.id)
  );
  
  return uniqueElements;
}

// Match specific widget IDs with elements
export function matchWidgetIdsWithElements(elementsWithIds, widgetIds) {
  const matches = [];
  
  widgetIds.forEach(widgetId => {
    const matchingElements = elementsWithIds.filter(element => 
      element.id === widgetId || 
      element.id.includes(widgetId) || 
      widgetId.includes(element.id)
    );
    
    if (matchingElements.length > 0) {
      matchingElements.forEach(element => {
        matches.push({
          widgetId: widgetId,
          element: element,
          matchType: element.id === widgetId ? 'exact' : 'partial',
          hasInnerContent: element.hasInnerContent
        });
      });
    }
  });
  
  return matches;
}

// Get inner content for matched widgets
export function getInnerContentForMatches(matches) {
  return matches.map(match => {
    return {
      ...match,
      innerContent: match.element.html,
      innerText: match.element.text,
      outerHtml: match.element.outerHtml
    };
  });
}