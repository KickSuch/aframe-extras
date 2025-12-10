AFRAME.registerComponent('room-scale-movement-adjuster', {
  schema: {
    constrainToNavMesh: { default: false },
    camera: { default: '[camera]', type: 'selector' }
  },

  init: function () {
    if (!this.data.camera) {
      this.data.camera = this.el.querySelector('[camera]');
    }
    this.navGroup = null;
    this.navNode = null;
  },

  tick: (function () {
    const start = new THREE.Vector3();
    const previousDelta = new THREE.Vector3();
    const delta = new THREE.Vector3();
    const end = new THREE.Vector3();
    const clampedEnd = new THREE.Vector3();

    return function (t, dt) {
      if (!dt) return;

      start.copy(this.el.object3D.position).sub(previousDelta);
      delta.x = this.data.camera.object3D.position.x;
      delta.z = this.data.camera.object3D.position.z;
      delta.applyQuaternion(this.el.object3D.quaternion);
      end.copy(start).add(delta);
      previousDelta.copy(delta);

      if (this.data.constrainToNavMesh) {
        const nav = this.el.sceneEl.systems.nav;
        this.navGroup = this.navGroup === null ? nav.getGroup(start) : this.navGroup;
        this.navNode = this.navNode || nav.getNode(start, this.navGroup);
        this.navNode = nav.clampStep(start, end, this.navGroup, this.navNode, clampedEnd);
        this.el.object3D.position.copy(clampedEnd);
      }
      else {
        this.el.object3D.position.copy(end);
      }
    };
  }()),
});
