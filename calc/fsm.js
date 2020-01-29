class FSM{
    constructor(states, initialState, acceptingStates){
        this.states = states;
        this.initialState = initialState;
        this.acceptingStates = acceptingStates;
        this.nextState = nextState;     // the transition function
    }

    nextState(currentState, input){
        switch(currentState){
            case 1:
                //
            case 2:
                //

        }
        
        return NoNextState;    // 'NoNextState' here is a constant 
                               //  to specify that there is no next 
                               //  state for the provided parameters.
    }

    // Runs this FSM on the specified 'input' string.
    // Returns 'true' if 'input' or a subset of 'input' matches
    // the regular expression corresponding to this FSM.
    run(input) {
        
        let currentState = this.initialState;

        for(let i = 0, length = input.length; i < length; ++i){
            let character = input.charAt(i);
            let nextState = this.nextState(currentState, character);

            // If the next state is one of the accepting states,
            // we return 'true' early.
            if (this.acceptingStates.has(nextState)) {
                return true;
            }
            
            if (nextState === NoNextState) {
                break;
            }
            
            currentState = nextState;
        }
        return this.acceptingStates.has(currentState);
    }
}