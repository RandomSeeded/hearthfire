'use strict';

const _ = require('lodash');

function createAction(objects) {
  let action = {Version: 1, Objects: objects, Slot: -1}
  return action;
}

function getMulliganAction(scene) {
  let mulligan = [];
  for (let card of scene['Self']['Cards']) {
    if (card['Cost'] > 3) {
      mulligan.push(card['RockId']);
    }
  }

  return createAction(mulligan);
}

function getPlayAction(scene) {
  // First thing to do: use mana efficiently
  // console.log('scene', JSON.stringify(scene, '', 2));
  if (scene['PlayOptions'].length == 0) {
    return null;
  }

  const handCards = _.clone(scene.Self.Cards);
  const handCardIds = _.map(handCards, 'RockId');
  const handCardsById = _.keyBy(handCards, 'RockId');
  const minionsById = _.keyBy(scene.Self.Minions, 'RockId');
  const enemyHero = scene.Opponent.Hero.RockId;
  // console.log('handCards', handCards);
  // console.log('handCardsById', handCardsById);

  const handOptions = _.reduce(scene.PlayOptions, (acc, option) => {
    // console.log('option', option);
    const actionSource = _.first(option);
    if (_.includes(handCardIds, actionSource)) {
      acc.push({
        RockId: actionSource,
        Cost: handCardsById[actionSource].Cost,
        PlayOption: option,
      });
    }
    return acc;
  }, []);
  const handOptionsByCost = _(handOptions).shuffle().sortBy(option => -1 * option.Cost).value();
  // console.log('handOptionsByCost', handOptionsByCost);

  const attackingOptions = _.reduce(scene.PlayOptions, (acc, option) => {
    // console.log('option', option);
    const attacker = _.first(option);
    const target = _.last(option);
    if (!!minionsById[attacker]) {
      acc.push({
        attacker,
        target,
        isAttackingEnemyHero: target === enemyHero,
        PlayOption: option,
      });
    }
    return acc;
  }, []);
  // console.log('attackingOptions', attackingOptions);

  const attackingHeroOptions = _.filter(attackingOptions, 'isAttackingEnemyHero');
  // console.log('attackingHeroOptions', attackingHeroOptions);

  const chosenAction = (() => {
    if (!_.isEmpty(handOptionsByCost)) {
      return _.first(handOptionsByCost).PlayOption;
    }

    if (!_.isEmpty(attackingHeroOptions)) {
      return _.first(attackingHeroOptions).PlayOption;
    }

    return scene.PlayOptions[Math.floor(Math.random() * scene['PlayOptions'].length)];
  })();
  // console.log('chosenAction', chosenAction);

  return createAction(chosenAction);
}

module.exports = {
  getMulliganAction,
  getPlayAction,
};
