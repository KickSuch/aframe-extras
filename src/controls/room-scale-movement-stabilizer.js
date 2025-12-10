AFRAME.registerComponent('room-scale-movement-stabilizer', {
  schema: {
    camera: { default: '[camera]', type: 'selector' }
  },

  init: function () {
    if (!this.data.camera) {
      this.data.camera = this.el.querySelector('[camera]');
    }
  },

  tick: function () {
    this.el.object3D.position.x = -this.data.camera.object3D.position.x;
    this.el.object3D.position.z = -this.data.camera.object3D.position.z;
  }
});
