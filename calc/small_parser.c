// E -> iE'
// E' -> +iE' | e

#include<stdio.h>

char l;

void match(char t){
    if(l == t){
        l = getchar();
    }else{
        printf("\nError");
    }
    
}

void Edash(){
    if(l == '+'){
        match('i');
        match('+');
        Edash();
    }
}

void E(){
    if(l == 'i'){
        match('i');
        Edash();
    }
}




int main(int argc, char* argv){
    l = getchar();
    E();

    if(l == '$')
        printf("\nParsing Successfull");
    return 0;
}
