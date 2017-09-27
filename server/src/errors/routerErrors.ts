import * as makeError from 'make-error';

export const NotFoundError = makeError('Resource not found');
export const RoutingError = makeError('Routing error');
export const InvalidQueryError = makeError('Invalid query');
export const ScrapeError = makeError('Scraping error');