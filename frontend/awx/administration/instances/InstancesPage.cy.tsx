import { InstancePage } from './InstancesPage';

describe('Instances Page', () => {
  beforeEach(() => {
    cy.intercept({ method: 'GET', url: '/api/v2/instances/*' }, { fixture: 'instance.json' }).as(
      'getInstance'
    );
  });

  it('Component renders, displays instance in breadcrumb and buttons enabled', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="page-title"]').should('have.text', 'receptor-1');
    cy.contains('nav[aria-label="Breadcrumb"]', 'receptor-1').should('exist');
    cy.get('[data-cy="back-to instances"]').should('be.visible');
    cy.get('[data-cy="back-to instances"]').should('be.enabled');
    cy.get('[data-cy="instances-details-tab"]').should('be.visible');
    cy.get('[data-cy="instances-details-tab"]').should('be.enabled');
    cy.get('[data-cy="instances-peers-tab"]').should('be.visible');
    cy.get('[data-cy="instances-peers-tab"]').should('be.enabled');
    cy.get('[data-cy="edit-instance"]').should('be.visible');
    cy.get('[data-cy="edit-instance"]').should('be.enabled');
    cy.get('[data-cy="remove-instance"]').should('be.visible');
    cy.get('[data-cy="remove-instance"]').should('be.enabled');
    cy.get('[data-cy="run-health-check"]').should('be.visible');
    cy.get('[data-cy="run-health-check"]').should('be.enabled');
  });

  it('edit instance button should be hidden for non-k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: false,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="edit-instance"]').should('not.exist');
  });

  it('edit instance button should be shown for k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="edit-instance"]').should('be.visible');
    cy.get('[data-cy="edit-instance"]').should('have.attr', 'aria-disabled', 'false');
  });

  it('only admin users can edit instance', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="edit-instance"]').should('be.visible');
        cy.get('[data-cy="edit-instance"]').should('have.attr', 'aria-disabled', 'false');
      });
  });

  it('edit instance button should be hidden for instance type control', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.intercept('GET', '/api/v2/instances/*', {
      fixture: 'instance_control.json',
    }).as('getInstance');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="edit-instance"]').should('not.exist');
      });
  });

  it('edit instance button should be hidden instance type hybrid', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.intercept('GET', '/api/v2/instances/*', {
      fixture: 'instance_hybrid.json',
    }).as('getInstance');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="edit-instance"]').should('not.exist');
      });
  });

  it('non admin users cannot remove instance', () => {
    cy.mount(<InstancePage />);
    cy.intercept({ method: 'GET', url: '/api/v2/me' }, { fixture: 'normalUser.json' });
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'true');
      });
  });

  it('remove instance button should be hidden for non-k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: false,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="remove-instance"]').should('not.exist');
  });

  it('remove instance button should be shown for k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="remove-instance"]').should('be.visible');
    cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'false');
  });

  it('only admin users can remove instance', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="remove-instance"]').should('be.visible');
        cy.get('[data-cy="remove-instance"]').should('have.attr', 'aria-disabled', 'false');
      });
  });

  it('remove instance button should be hidden for instance type control', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.intercept('GET', '/api/v2/instances/*', {
      fixture: 'instance_control.json',
    }).as('getInstance');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="remove-instance"]').should('not.exist');
      });
  });

  it('remove instance button should be hidden instance type hybrid', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.intercept('GET', '/api/v2/instances/*', {
      fixture: 'instance_hybrid.json',
    }).as('getInstance');
    cy.mount(<InstancePage />);
    cy.wait('@getInstance')
      .its('response.body')
      .then(() => {
        cy.get('[data-cy="remove-instance"]').should('not.exist');
      });
  });

  it('peers tab should be hidden for non-k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: false,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="instances-peers-tab"]').should('not.exist');
  });

  it('peers tab should be shown for k8s system', () => {
    cy.intercept('GET', '/api/v2/settings/system*', {
      IS_K8S: true,
    }).as('isK8s');
    cy.mount(<InstancePage />);
    cy.get('[data-cy="instances-peers-tab"]').should('not.exist');
  });
});