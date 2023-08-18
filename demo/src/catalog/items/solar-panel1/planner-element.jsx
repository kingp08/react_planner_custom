import * as Three from 'three';
import React from 'react';

const PI_2 = Math.PI / 2;
const paintedtexture = require('./texture.jpg');
const scale = 100;

let textureLoader = new Three.TextureLoader();
textureLoader.setPath('./');
let mat = textureLoader.load(paintedtexture);

function makeObject(newWidth, newHeight, newDepth) {

  let balcony = new Three.Mesh();
  //base
  let cubeGeometryBase = new Three.BoxGeometry(newWidth, newHeight / 10, newDepth);
  let cubeMaterial = new Three.MeshLambertMaterial({ map: mat });

  let p1 = new Three.Mesh(cubeGeometryBase, cubeMaterial);

  return balcony.add(p1);
}

export default {
  name: 'solar panel',
  prototype: 'items',

  info: {
    tag: ['furnishings', 'electronics'],
    title: 'Solar Panel 1',
    description: 'Solar Panel 1',
    image: require('./texture.jpg')
  },
  properties: {
    width: {
      label: 'width',
      type: 'length-measure',
      defaultValue: {
        length: 500,
        unit: 'cm'
      }
    },
    depth: {
      label: 'depth',
      type: 'length-measure',
      defaultValue: {
        length: 100,
        unit: 'cm'
      }
    },
    height: {
      label: 'height',
      type: 'length-measure',
      defaultValue: {
        length: 100,
        unit: 'cm'
      }
    },
    altitude: {
      label: 'altitude',
      type: 'length-measure',
      defaultValue: {
        length: 0,
        unit: 'cm'
      }
    },
    patternColor: {
      label: '2D color',
      type: 'color',
      defaultValue: '#f5f4f4'
    }
  },

  render2D: function (element, layer, scene) {

    let newWidth = element.properties.getIn(['width', 'length']);
    let newDepth = element.properties.getIn(['depth', 'length']);
    let fillValue = element.selected ? '#99c3fb' : element.properties.get('patternColor');
    let angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key='1' x='0' y='0' width={newWidth} height={newDepth}
          style={{ stroke: element.selected ? '#0096fd' : '#000', strokeWidth: '2px', fill: fillValue }} />
        <text key='2' x='0' y='0'
          transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
          style={{ textAnchor: 'middle', fontSize: '11px' }}>
          {element.name}
        </text>
      </g>
    )
  },

  render3D: function (element, layer, scene) {

    let newWidth = element.properties.getIn(['width', 'length']);
    let newDepth = element.properties.getIn(['depth', 'length']);
    let newHeight = element.properties.getIn(['height', 'length']);
    let newAltitude = element.properties.getIn(['altitude', 'length']);

    let balcony = new Three.Object3D();
    balcony.add(makeObject(newWidth, newHeight, newDepth));

    if (element.selected) {
      let bbox = new Three.BoxHelper(balcony, 0x99c3fb);
      bbox.material.linewidth = 5;
      bbox.renderOrder = 1000;
      bbox.material.depthTest = false;
      balcony.add(bbox);
    }

    balcony.position.y += newHeight / 10 + newAltitude;
    return Promise.resolve(balcony);
  }

};

