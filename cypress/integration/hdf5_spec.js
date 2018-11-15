describe('HDF5 Interface Test', function() {
  it('Visit Image', function() {
    cy.visit('http://localhost:8888/images.html')
    cy.get('#nwCanvas').click();
  })
})
