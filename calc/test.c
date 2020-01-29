#include<stdio.h>


int main(){
    char c;
    scanf("%c",&c);
    if(c == '\r')
        printf("carriage return\n");
    else if(c == '\n')
        printf("newline\n");
    return 0;
}