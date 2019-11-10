/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

describe('HDF5 Dataset Test', function() {
  it('Visit TypedArray', function() {
    cy.server()
    cy.route('POST', '/read_dataset/*').as('rd')
    cy.visit('https://localhost:8888/typedarrays.html')
    cy.get('#pressme').click().wait('@rd');
  });
});