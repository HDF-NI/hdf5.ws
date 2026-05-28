describe('HDF5 Interface Test', function() {
  it('Visit Image', function() {
      const dataTransfer = new DataTransfer;
    cy.server()
    cy.route('POST', '/read_image/').as('ri')
    cy.visit('https://localhost:8888/images.html')
    cy.get('#nwCanvas').trigger('mousedown', {which: 1})
                       .trigger('dragstart', {dataTransfer}).trigger('drag', {dataTransfer}).trigger('dragend')
                       .trigger('mousemove', {clientX: 250, clientY: 381 })
                       .trigger('mouseleave')
                       .get('#droppable')
                       .trigger('mousemove', {clientX: 250, clientY: 500 })
                       .trigger('dragover').trigger('drop', {dataTransfer})
                       .trigger('mouseup', {force: true}).get('@ri');
  });
});
