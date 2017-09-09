import MTLLoader from '../lib/MTLLoader';

export default class MTLModule {
  static loader = new MTLLoader();

  constructor(url, fix = () => {}) {
    this.bridge = {
      mesh(mesh) {
        this.wait(new Promise(resolve => {
          MTLModule.loader.load(url, function(materials) {
            materials.preload();

            mesh.traverse(child => {
              if (!child.material) return;

              if (child.material.length) {
                const destMats = [];

                child.material.forEach(material => {
                  const destMaterial = materials.materials[material.name];
                  fix(destMaterial, material.name);

                  destMats.push(destMaterial);
                });

                child.material = destMats;
              } else {
                const name = child.material.name;
                const material = materials.materials[name];

                fix(material, name);
                child.material = name ? material : child.material;
              }
            });

            resolve();
          });
        }));

        return mesh;
      }
    };
  }
}
