import { Client, Server } from 'styletron-engine-atomic';

const getHydrateClass = () => document.getElementsByClassName('_styletron_hydrate_');

const styletron = typeof window === 'undefined'
  ? new Server()
  : new Client({
    hydrate: getHydrateClass(),
  });
export default styletron;
