/* 
*---------------------LEXICAL GRAMMAR-----------------------
*   letter = [a-zA-Z]
*   digit = [0-9]
*   digits = digit digit*
*   identifier = letter | (letter | digit | _ )*
*   fraction = . digits | epsilon
*   exponent = ((E | e) (+ | - | epsilon)) digits) | epsilon
*   number = digits fraction exponent
*   operator = + | - | * | / | > | >= | < | <= | = | == 
*   parenthesis = ( | )
*     
*/


// Add a token type for each valid lexeme
let TokenType = {
    // identifiers and literals
    Identifier: 'identifier',
    Number: 'number',

    // arithmetic operators
    Plus: 'plus',
    Minus: 'minus',
    Times: 'times',
    Div: 'div',

    // comparison operators
    GreaterThan: 'greater than',
    GreaterThanOrEqual: 'greater than or equal',
    LessThan: 'less than',
    LessThanOrEqual: 'less than or equal',
    Equal: 'equal',

    // assignment operator
    Assign: 'assign',

    // parenthesis
    LeftParenthesis: 'left parenthesis',
    RightParenthesis: 'right parenthesis',

    // to detect end of input - special token
    EndOfInput: 'end of input'
};

class Token {
    //  type :   A 'TokenType' corresponding to the type 
    //          of newly created 'Token'.
    //  value:   The 'String' value of the token.
    //          The actual characters of the lexeme described.
    //  line :  The line number where the token
    //          was encountered in the source code.
    //  column: The column number where the token 
    //          was encountered in the source code.

    constructor(type, value, line, column) {
        this.type = type;
        this.value = value;
        this.line = line;
        this.column = column;
    }

}

class FSM{
    // constructor(states, initialState, acceptingStates, nextState){
    //     this.states = states;
    //     this.initialState = initialState;
    //     this.acceptingStates = acceptingStates;
    //     this.nextState = nextState; // the transition function
    //     }

    // nextState(currentState, input){
    //     switch(currentState){
    //         case 1:
    //             //
    //         case 2:
    //             //

    //     }
        
    //     return NoNextState;    // 'NoNextState' here is a constant 
    //                            //  to specify that there is no next 
    //                            //  state for the provided parameters.
    // }

    // Runs this FSM on the specified 'input' string.
    // Returns 'true' if 'input' or a subset of 'input' matches
    // the regular expression corresponding to this FSM.
    run(input) {
        
        let currentState = this.initialState;
        console.log('currentState: '+currentState);
        let j = 0;
        for(let i = 0, length = input.length; i < length; ++i){
            j = i;
            let character = input.charAt(i);
            let nextState = this.nextState(currentState, character);
            console.log('nextState: '+nextState);
            // If the next state is one of the accepting states,
            // we return 'true' early.
            // if (this.acceptingStates.has(nextState)) {
            //     console.log('IN FIRST IF');
            //     return  [true, input.substring(0,i+1)];
            // }
            
            if (nextState === -1) {
                break;
            }
            
            currentState = nextState;
        }
        return this.acceptingStates.has(currentState) ? [true, input.substring(0,j)] : [false , null] ;
    }
}

class CharUtils {

    static isLetterOrDigit(char) {
        return CharUtils.isLetter(char) || CharUtils.isDigit(char);
    }

    static isLetter(char) {
        console.log('In CharUtils.isLetter()');
        var code = char.charCodeAt(0);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
    }

    static isDigit(char) {
        console.log('In CharUtils.isDigit()');
        var code = char.charCodeAt(0);
        return code >= 48 && code <= 57;
    }

    static isWhitespace(char) {
        return /[ \t\r\f\v\u00A0\u2028\u2029]/.test(char);
    }

    static isDelimiter(char) {
        return char === '{' || char === '[' || char === '('
            || char === '}' || char === ']' || char === ')'
            || char === ':' || char === ',';
    }

    static isNewline(char) {
        console.log('In CharUtils.isNewline()');
        return char === '\n' || char === '\r\n';
    }

    static isDot(char) {
        return char === '.';
    }

    static isOperator(char) {
        console.log('In CharUtils.isOperator()');
        return char === '+' || char === '-' || char === '*' || char === '/'
            || char === '=' || char === '>' || char === '<' || char === '!'
            || char === '&' || char === '|' || char === '%' || char === '~'
            || char === '$' || char === '~' || char === '^';
    }

    static isComparisonOperator(char){
        return char === '<' || char === '>' || char === '='; 
    }

    static isArithmeticOperator(char){
        return char === '+' || char === '-' || char === '/' || char === '*'; 
    }

    static isParenthesis(char){
        console.log('In CharUtils.isParenthesis()');
        return char === ')' || char === '(';
    }

    static isIdentifierPart(char) {
        console.log('In CharUtils.isIdentifierPart()');
        return char === '_' ||  CharUtils.isLetterOrDigit(char) || CharUtils.isOperator(char);
    }

    static isBeginningOfIdentifier(char) {
        console.log('In CharUtils.isBeginningOfIdentifier()');
        return CharUtils.isLetter(char) || char === '_';
    }

    static isBeginningOfNumber(char) {
        return CharUtils.isDigit(char) || char === '.';
    }

    static isBeginningOfString(char) {
        return char === '"';
    }

    static isExponentSymbol(char) {
        return char === 'e' || char === 'E';
    }

    static isBeginningOfLiteral(char) {
        return CharUtils.isLetter(char) || CharUtils.isBeginningOfIdentifier(char)
            || CharUtils.isBeginningOfNumber(char) || CharUtils.isBeginningOfString(char);
    }

    static isEscapeCharacter(char) {
        return char === '\\';
    }

    static isEndOfEscapeSequence(char) {
        return char === '\"' || char === '\\' || char === 'n'
            || char === 'r' || char === 't' || char === 'b'
            || char === 'f' || char === 'v' || char === '0';
    }

    static isStringDelimiter(char) {
        return char === '\"';
    }
}

class Lexer {
    constructor(input){
        console.log('inside lexer constructor');
        this.input = input;
        this.position = 0;
        this.line = 0;
        this.column = 0;
        console.log('out of lexer constructor');
    }

    // returns the next recognized 'Token' in the input
    nextToken() {

        console.log('in next token');
        if(this.position >= this.input.length){
            return new Token(TokenType.EndOfInput, 'END', this.line, this.column);
        }

        // we skip all the whitespaces and new lines in the input;
        console.log('Before removing whitespaces position: '+this.position);
        this.skipWhitespacesAndNewLines();
        console.log('After removing whitespaces position: '+this.position);
        let character = this.input.charAt(this.position);
        console.log('character: '+ character);
        
        if(CharUtils.isOperator(character)){
            return this.recognizeOperator();
        }
        
        if(CharUtils.isLetter(character)) {
            return this.recognizeIdentifier();
        }

        if(CharUtils.isDigit(character)) {
            return this.recognizeNumber();
        }
        if(CharUtils.isParenthesis(character)){
            return this.recognizeParenthesis();
        }

        // throw an error if the current character does not match
        // any production rule of the lexical grammar.

        throw new Error('Unrecognized character ' + character + ' at line ' +
                        + this.line + ' and column ' + this.column );

    }

    skipWhitespacesAndNewLines(){
        console.log('in skip white spaces and newlines');
        console.log("Old Position: " + this.position);
        while(this.position < this.input.length && 
            (CharUtils.isWhitespace(this.input.charAt(this.position)) || CharUtils.isNewline(this.input.charAt(this.position)))){
                    
                this.position += 1;

                if(CharUtils.isNewline(this.input.charAt(this.position))){
                    this.line += 1;
                    this.column = 0;
                } else {
                    this.column += 1;
                }
        }
        console.log("New Position: " + this.position);
        console.log('out of skip white spaces and newlines');
    }

    // retrieves all tokens by repetitively calling nextToken()
    allTokens() {
        console.log('in alltokens()');
        let token = this.nextToken();
        let tokens = [];
        while (token.type !== TokenType.EndOfInput) {
            tokens.push(token);
            console.log(tokens);
            token = this.nextToken();
            console.log(token +'  '+this.input.charAt(this.position));

            if(typeof(token) === 'undefined'){
                console.log('token is undefined :' + token);
            }
        }
        console.log('going out of allTokens()');
        return tokens;
    }

    // recognizes and returns a parenthesis token.
    // parenthesis = ( | )
    recognizeParenthesis(){
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        this.position += 1;
        this.column += 1;

        if(character === '('){
            return new Token(TokenType.LeftParenthesis,'(', line, column);
        }

        return new Token(TokenType.RightParenthesis,')', line, column);
    }

    // recognizes and returns an operator token.
    // operator = + | - | * | / | > | >= | < | <= | = | ==
    recognizeOperator(){
        console.log("in recognizeOperator()");
        let character = this.input.charAt(this.position);

        if(CharUtils.isComparisonOperator(character)){
            return this.recognizeComparisonOperator();
        }

        if(CharUtils.isArithmeticOperator(character)){
            return this.recognizeArithmeticOperator();
        }
    }

    recognizeArithmeticOperator(){
        console.log('In recognizeArithmeticOperator');
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        this.position += 1;
        this.column += 1;

        switch (character) {
            case '+':
                return new Token(TokenType.Plus, '+', line, column);
                
            case '-':
                return new Token(TokenType.Minus, '-', line, column);
                
            case '*':
                return new Token(TokenType.Times, '*', line, column);
                
            case '/':
                return new Token(TokenType.Div, '/', line, column);
            default:
                break;
        }
    }

    recognizeComparisonOperator(){
        console.log('In recognizeComparisonOperator');
        let position = this.position;
        let line = this.line;
        let column = this.column;
        let character = this.input.charAt(position);

        // 'lookahead' is the next character in the input
        // or 'null' if 'character' was the last character.
        
        let lookahead = position + 1 < this.input.length ? this.input.charAt(position + 1) : null;

        // whether the 'lookahead' character is the equal symbol '='.
        let isLookaheadEqualSymbol = lookahead !== null && lookahead === '=';

        this.position += 1;
        this.column += 1;

        if(isLookaheadEqualSymbol){
            this.position += 1;
            this.column += 1;
        }

        switch(character){
            case '>':
                return isLookaheadEqualSymbol
                    ? new Token(TokenType.GreaterThanOrEqual, '>=', line, column)
                    : new Token(TokenType.GreaterThan, '>', line, column);
            
            case '<':
                return isLookaheadEqualSymbol
                    ? new Token(TokenType.LessThanOrEqual, '<=', line, column)
                    : new Token(TokenType.LessThan, '>', line, column);
            
            case '=':
                return isLookaheadEqualSymbol
                    ? new Token(TokenType.Equal, '==', line, column)
                    : new Token(TokenType.Assign, '=', line, column);
            default:
                break;
        }

    }

    // recognizes and returns an identifier token.
    // letter     = [a-zA-Z]
    // digit      = [0-9]
    // identifier = letter | ( letter | digit | _ )*
    recognizeIdentifier(){
        console.log('In recognizeIdentifier()');
        let identifier = '';
        let line = this.line;
        let column = this.column;
        let position = this.position;

        while(position < this.input.length){
            let character = this.input.charAt(position);

            if(!(CharUtils.isLetter(character) || CharUtils.isDigit(character) || character === '_')) {
                break;
            }

            identifier += character;
            position += 1;
        }

        this.position += identifier.length;
        this.column += identifier.length;

        return new Token(TokenType.Identifier, identifier, line, column);
    }

    // recognizes and returns a number token.
    // digit     = [0-9]
    // digits    = digit digit*
    // fraction  = .digits | epsilon
    // exponent  = ((E | e) (+ | - | epsilon)) digits) | epsilon
    // number    = digits fraction exponent 
    recognizeNumber(){
        let line = this.line;
        let column = this.column;

        // we delegate the building of the FSM to a helper method.
        let fsm = this.buildNumberRecognizer();

        // the input to the FSM will be all the characters from 
        // the current position to the rest of the lexer's input.
        let fsmInput = this.input.substring(this.position);
        console.log('fsmInput: '+ fsmInput);

        // in addition of FSM returning whether a number 
        // has been recognized or not, it also returns the number
        // recognized in the 'number' variable. If no number has been 
        // recognized, 'number' will be null.
        let [isNumberRecognized, number] = fsm.run(fsmInput);
        console.log('isNumberRecognized: '+ isNumberRecognized);
        console.log('number: '+number)
        if(isNumberRecognized){
            this.position += number.length;
            this.column += number.length;

            return new Token(TokenType.Number, number, line, column);
        }
    }

    buildNumberRecognizer(){
        // we name our states for readability.
        let State = {
            Initial: 1,
            Integer: 2,
            BeginNumberWithFractionalPart: 3,
            NumberWithFractionalPart: 4,
            BeginNumberWithExponent: 5,
            BeginNumberWithSignedExponent: 6, 
            NumberWithExponent: 7,
            NoNextState: -1
        };

        let fsm = new FSM();
        fsm.states = new Set([State.Initial, State.Integer,
                            State.BeginNumberWithFractionalPart,
                            State.NumberWithFractionalPart,
                            State.BeginNumberWithExponent,
                            State.BeginNumberWithSignedExponent,
                            State.NumberWithExponent,
                            State.NoNextState]);
        fsm.initialState = State.Initial;
        fsm.acceptingStates = new Set([State.Integer,
                                    State.NumberWithFractionalPart,
                                    State.NumberWithExponent]);
        fsm.nextState = (currentState, character) => {

            switch (currentState) {
                case State.Initial:
                                    if(CharUtils.isDigit(character)){
                                        return State.Integer;
                                    }
                                    break;
                case State.Integer:
                                    if(CharUtils.isDigit(character)){
                                        return State.Integer;
                                    }

                                    if(character === '.'){
                                        return State.BeginNumberWithFractionalPart;
                                    }

                                    if(character.toLowerCase() === 'e'){
                                        return State.BeginNumberWithExponent;
                                    }

                                    break;

                case State.BeginNumberWithFractionalPart:
                                    
                                    if(CharUtils.isDigit(character)){
                                        return State.NumberWithFractionalPart;
                                    }
                                    break;
                        
                case State.NumberWithFractionalPart:
                                    if(CharUtils.isDigit(character)){
                                        return State.NumberWithFractionalPart;
                                    }

                                    if(character.toLowerCase() === 'e'){
                                        return State.BeginNumberWithExponent;
                                    }
                                    break;

                case State.BeginNumberWithExponent:
                                    if (character === '+' || character === '-'){
                                        return State.BeginNumberWithSignedExponent;
                                    }
                                    
                                    if (CharUtils.isDigit(character)) {
                                        return State.NumberWithExponent;
                                    }
                                    break;

                case State.BeginNumberWithSignedExponent:
                                    if (CharUtils.isDigit(character)) {
                                        return State.NumberWithExponent;
                                    }
                                    break;
                     
                default:
                                    break;
                
                
            }

            return State.NoNextState;
        };

            return fsm;
    }
}

lex = new Lexer('1 + 2\n'+
                '(5 - 4) + 7\n'+
                '12.34 * 5e-9\n'+
                'pi = 22 / 7\n'+
                'radius = 5\n'+
                'circle_circumference = 2 * pi * radius');
// lex.skipWhitespacesAndNewLines();
// console.log(lex.input);
tokens = lex.allTokens()
console.log(tokens);