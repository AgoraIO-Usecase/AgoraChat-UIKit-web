/* eslint-disable no-var */
// @ts-nocheck
function hexToRgb(hex: string) {
  // 判断颜色值是否符合对应格式
  const reg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = reg.exec(hex);
  if (!result) {
    return null;
  }

  // 将颜色值转化为RGB颜色值
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return [r, g, b];
}

function rgbToHsla(rgb: number[]) {
  // 将RGB值转化为0-1之间的比例值
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  // 计算最大、最小颜色分量值和亮度值
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  // 计算饱和度值
  var s: any = 0;
  let d = 0;
  if (max !== min) {
    d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  }

  // 计算色相值
  var h: any = 0;
  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // 计算透明度值，默认为1（不透明）
  const a = 1;
  // 转换hsl为hsla
  const hsla = `hsla(${Math.round(h * 360)},${Math.round(s * 100)}%,${Math.round(l * 100)}%,1)`;
  return hsla; //[h, s, l, a];
}

function hexToHsla(hex: string) {
  const rgb = hexToRgb(hex);
  if (rgb === null) {
    return null;
  }

  return rgbToHsla(rgb);
}

// console.log(hexToHsla('#ffffff'));
// [0, 1, 0.5, 1]

function generateColors(
  baseColor: string,
  lights: number[] = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 35, 38, 40],
) {
  const colorArr = baseColor.split(',');
  const lightness = parseInt(colorArr[2]);
  const colors = [];

  for (let i = 0; i < lights.length; i++) {
    const light = lightness + lights[i];
    colorArr[2] = light + '%';
    const color = colorArr.join(',');
    colors.push(color);
  }
  setGlobalColors(colors);
  return colors;
}

function setGlobalColors(colors: string[]) {
  document.documentElement.style.setProperty('--cui-primary-color1', colors[0]);
  document.documentElement.style.setProperty('--cui-primary-color2', colors[1]);
  document.documentElement.style.setProperty('--cui-primary-color3', colors[2]);
  document.documentElement.style.setProperty('--cui-primary-color4', colors[3]);
  document.documentElement.style.setProperty('--cui-primary-color5', colors[4]);
  document.documentElement.style.setProperty('--cui-primary-color', colors[5]);
  document.documentElement.style.setProperty('--cui-primary-color7', colors[6]);
  document.documentElement.style.setProperty('--cui-primary-color8', colors[7]);
  document.documentElement.style.setProperty('--cui-primary-color9', colors[8]);
  document.documentElement.style.setProperty('--cui-primary-color95', colors[9]);
  document.documentElement.style.setProperty('--cui-primary-color98', colors[10]);
  document.documentElement.style.setProperty('--cui-primary-color10', colors[11]);
}

const isHueValue = (value: number) => {
  return typeof value === 'number' && value >= 0 && value <= 360;
};

const isHexColor = (value: string) => {
  return typeof value === 'string' && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
};
export { hexToHsla, generateColors, isHueValue, isHexColor };
