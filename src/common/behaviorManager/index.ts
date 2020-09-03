import G6 from '@antv/g6';
import { Behavior, RegisteredBehaviors } from '@/common/interfaces';
import { forEach, keys } from 'lodash';

class BehaviorManager {
  behaviors: {
    [propName: string]: Behavior;
  };

  constructor() {
    this.behaviors = {};
  }

  getRegisteredBehaviors(): RegisteredBehaviors {
    const registeredBehaviors: RegisteredBehaviors = {};

    forEach(this.behaviors, (val: any, key: string) => {
      const behavior = this.behaviors[key];
      const { graphMode = 'default' } = behavior;

      if (!registeredBehaviors[graphMode]) {
        registeredBehaviors[graphMode] = {};
      }

      registeredBehaviors[graphMode][key] = key;
    });
    return registeredBehaviors;
  }

  register(name: string, behavior: Behavior) {
    this.behaviors[name] = behavior;

    G6.registerBehavior(name, behavior);
  }
}

export default new BehaviorManager();
