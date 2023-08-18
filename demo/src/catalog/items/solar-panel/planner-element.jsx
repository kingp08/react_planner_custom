import * as Three from 'three';
import {loadObjWithMaterial} from '../../utils/load-obj';
import path from 'path';
import React from 'react';
import convert from 'convert-units';

let cached3DTV = null;

export default {
  name: "solar panel",
  prototype: "items",

  info: {
    title: "Solar Panel",
    tag: ['furnishings', 'electronics'],
    description: "Solar Panel",
    image: require('./solar-panel.jpg')
  },

  properties: {
    altitude: {
      label: "Altitude",
      type: "length-measure",
      defaultValue: {
        length: 0
      }
    }
  },

  render2D: function (element, layer, scene) {
    let width = {length: 1.60, unit: 'ft'};
    let depth = {length: 0.59, unit: 'ft'};

    let newWidth = convert(width.length).from(width.unit).to(scene.unit);
    let newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

    let angle = element.rotation + 90;

    let textRotation = 0;
    if (Math.sin(angle * Math.PI / 180) < 0) {
      textRotation = 180;
    }

    let style = {stroke: element.selected ? '#0096fd' : '#000', strokeWidth: "2px", fill: "#84e1ce"};
    let arrow_style = {stroke: element.selected ? '#0096fd' : null, strokeWidth: "2px", fill: "#84e1ce"};

    return (
      <g transform={`translate(${-newWidth / 2},${-newDepth / 2})`}>
        <rect key="1" x="0" y="0" width={newWidth} height={newDepth} style={style}/>
        <line key="2" x1={newWidth / 2} x2={newWidth / 2} y1={newDepth} y2={1.5 * newDepth} style={arrow_style}/>
        <line key="3" x1={.35 * newWidth} x2={newWidth / 2} y1={1.2 * newDepth} y2={1.5 * newDepth} style={arrow_style}/>
        <line key="4" x1={newWidth / 2} x2={.65 * newWidth} y1={1.5 * newDepth} y2={1.2 * newDepth} style={arrow_style}/>
        <text key="5" x="0" y="0" transform={`translate(${newWidth / 2}, ${newDepth / 2}) scale(1,-1) rotate(${textRotation})`}
              style={{textAnchor: "middle", fontSize: "11px"}}>
          {element.type}
        </text>
      </g>
    );
  },

  render3D: function (element, layer, scene) {
    let width = {length: 1.60, unit: 'ft'};
    let depth = {length: 0.59, unit: 'ft'};
    let height = {length: 1.05, unit: 'ft'};

    let onLoadItem = (object) => {

      let newWidth = convert(width.length).from(width.unit).to(scene.unit);
      let newHeight = convert(height.length).from(height.unit).to(scene.unit);
      let newDepth = convert(depth.length).from(depth.unit).to(scene.unit);

      let newAltitude = element.properties.get('altitude').get('length');
      
      if (element.selected) {
        let box = new Three.BoxHelper(object, 0x99c3fb);
        box.material.linewidth = 2;
        box.material.depthTest = false;
        box.material.opacity = .3;
        box.renderOrder = 1000;
        //object.add(box);
      }

      object.scale.set(newWidth / width.length, newHeight / height.length, newDepth / depth.length);

      // Normalize the origin of the object
      let boundingBox = new Three.Box3().setFromObject(object);

      let center = [
        (boundingBox.max.x - boundingBox.min.x) / 2 + boundingBox.min.x,
        (boundingBox.max.y - boundingBox.min.y) / 2 + boundingBox.min.y,
        (boundingBox.max.z - boundingBox.min.z) / 2 + boundingBox.min.z];

      object.position.x -= center[0];
      object.position.y -= center[1] - (boundingBox.max.y - boundingBox.min.y) / 2;
      object.position.z -= center[2];

      object.position.y += newAltitude;

      object.rotation.y = Math.PI;

      return object;
    };

    console.log('----', element, element.selected)

    if (cached3DTV) {
      // let loader = new ObjectLoader();
      // let object = loader.parse(cached3DTV);
      // return Promise.resolve(onLoadItem(object));
      return Promise.resolve(onLoadItem(cached3DTV.clone()));
    }

    let mtl = require('./solar-panel.mtl');
    let obj = require('./solar-panel.obj');
    let img = require('./solar-panel.jpg');

    return loadObjWithMaterial(mtl, obj, path.dirname(img) + '/')
      .then(object => {
        // cached3DTV = object.toJSON();
        // let loader = new ObjectLoader();
        // return onLoadItem(loader.parse(cached3DTV))
        cached3DTV = object;
        console.log('yyyy', object)
        return onLoadItem(cached3DTV.clone())
      });
  }

};
