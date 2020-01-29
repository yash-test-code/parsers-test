#define DELIMITER  1
#define VARIABLE 2
#define NUMBER 3

extern char *prog;      /* points to the expression to be analyzed */
char token[80];
char tok_type;


/* Return next token*/
void get_token(){
    register char *temp;
    tok_type = 0;
    temp = token;
    *temp = '\0';

    if(!prog)       /* at the end of expression*/
        return;

    /* ignore whitespaces */
    while(isspace(*prog))
        ++prog;
    
    if(strchr("+-*/%^=()",*prog)){
        tok_type = DELIMITER;
        /* advance to next char */
        *temp = *prog;
        temp++;
        prog++;
    }
    else if(isalpha(*prog)){
        while(!isdelim(*prog))
            *temp++ = *prog++;
        tok_type = VARIABLE;
    }
    else if(isdigit(*prog)){
        while(!isdelim(*prog))
            *temp = *prog;
        tok_type = NUMBER;
    }

    *temp = '\0';
}


/* Return true if c is a delimiter */
int isdelim(char c){
    if(strchr(" +-*/%^=()", c) || c == 9 || c == '\r' || c == 0)
        return 1;
    return 0;
}