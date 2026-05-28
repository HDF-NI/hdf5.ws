/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe('HDF5 Paning Test', function() {
  it('Visit TypedArray', function() {
    cy.server()
    cy.route('POST', '/read_image_mosaic/').as('rim')
    cy.visit('https://localhost:8888/panningimages.html')
    //cy.get('#pressme').click()
    .get('@rim');
  });
});