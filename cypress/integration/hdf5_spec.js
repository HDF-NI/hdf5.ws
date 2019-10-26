describe('HDF5 Interface Test', function() {
  it('Visit Image', function() {
    cy.visit('http://localhost:8888/images.html')
    cy.get('#nwCanvas').trigger('mousedown', 100, 100).trigger('mousemove', { clientX: 100, clientY: 500 }).trigger('mouseup', {force: true});
  })
})
