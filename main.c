#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <time.h>
#include <string.h>

CONSOLE_FONT_INFOEX cfi;
COORD cursor = {0, 0};

int fontsize = 15; //5

int xoffset = 2; //30
int yoffset = 2; //10

int boardX = 15;
int boardY = 15;

int dificuldade=2;
int wordNumber = 5;

COORD boardPosition = {1,1};

struct cursor{
    COORD position;
    COORD previousPosition;

    COORD selected;
};

char words[10][6]={
    {"CASA\0"},
    {"GARFO\0"},
    {"ARARA\0"},
    {"JAVALI"},
    {"TINTA\0"},
    {"BANCO\0"},
    {"CABIDE"},
    {"FORRO\0"},
    {"HOJE\0"},
    {"PEAO\0"}
};

struct word{
    char text[6];
    COORD start;
    COORD end;
    int found;
};

//65>90

void adjustFont(){
    cfi.cbSize = sizeof cfi;
    cfi.nFont = 0;
    cfi.dwFontSize.X = fontsize;
    cfi.dwFontSize.Y = cfi.dwFontSize.X*1.8;
    cfi.FontFamily = FF_DONTCARE;
    cfi.FontWeight = FW_NORMAL;

    SetCurrentConsoleFontEx(GetStdHandle(STD_OUTPUT_HANDLE), FALSE, &cfi);
}

void gotoxy (COORD position)                                               /// -|
{
    //position.X += xoffset; position.Y += yoffset; /// X and Y coordinates      /// -3-
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), position);   /// -|
}

void textcolor (int color)                                      /// -|
{                                                               /// -|
    static int __BACKGROUND;                                    /// -|
                                                                /// -|
    HANDLE h = GetStdHandle ( STD_OUTPUT_HANDLE );              /// -|
    CONSOLE_SCREEN_BUFFER_INFO csbiInfo;                        /// -|
                                                                /// -2-
                                                                /// -|
    GetConsoleScreenBufferInfo(h, &csbiInfo);                   /// -|
                                                                /// -|
    SetConsoleTextAttribute (GetStdHandle (STD_OUTPUT_HANDLE),  /// -|
                             color + (__BACKGROUND << 4));      /// -|
}

int random(int min, int max){               ///-|
    int num;                                ///-|
    num = (rand() % (max - min + 1)) + min; ///-1-
    return(num);                            ///-|
}

void printBoard(int board[boardX][boardY][2]){
    for(int x=0; x<boardX; x++){
        for(int y=0; y<boardY; y++){
            if (1==1){
                cursor.X = x *2 + boardPosition.X, cursor.Y = y+ boardPosition.Y;
                gotoxy(cursor);
                textcolor(board[x][y][1]);
                printf("%c ", board[x][y][0]);

                //score.current++;
            }
        }
    }
}

void initializeBoard(int board[boardX][boardY][2]){
    for(int x=0; x<boardX; x++){
        for(int y=0; y<boardY; y++){
            if (1==1){
                board[x][y][0]= 12;
                board[x][y][1] = 10;
            }
        }
    }
}

void spawnWords(int board[boardX][boardY][2]){

    int vertical = 0, horizontal =0;
    int direction =0;
    int success = 0;

    COORD wordStart;
    COORD currentLetterPosition;

    printBoard(board);
    printf("\n");

    for(int w = 0; w<wordNumber; w++){
        success = 0;
        while(1){
            vertical = 0, horizontal = 0;

            if(dificuldade == 0){
                direction = random(0,1);
                if(direction) horizontal = 1;
                else vertical = 1;
            }

            if(dificuldade == 1){
                direction = random(0,1);
                if(direction){
                    horizontal = random(0,1);
                    if(!horizontal)horizontal=-1;
                }
                else{
                    vertical = random(0,1);
                    if(!vertical)vertical = -1;
                }
            }

            if(dificuldade == 2){
                direction = random(0,7);
                switch (direction){
                    case 0: horizontal = 1, vertical = 0; break;
                    case 1: horizontal = 1, vertical = -1; break;
                    case 2: horizontal = 0, vertical = -1; break;
                    case 3: horizontal = -1, vertical = -1; break;
                    case 4: horizontal = -1, vertical = 0; break;
                    case 5: horizontal = -1, vertical = 1; break;
                    case 6: horizontal = 0, vertical = 1; break;
                    case 7: horizontal = 1, vertical = 1; break;
                    default: break;
                }
            }

            wordStart.X = random(0, boardX-1);
            wordStart.Y = random(0, boardY-1);

            //printf("-------PALAVRA: %d \n", w);
            //printf("tentando dire��o: %d, %d / posi��o: %d, %d \n", horizontal, vertical, wordStart.X, wordStart.Y);
            //getch();

            for(int l=0; l<6; l++){
                if(words[w][l] == '\0'){
                    success = 1;
                    break;
                }

                currentLetterPosition.X = wordStart.X + (l * horizontal);
                currentLetterPosition.Y = wordStart.Y + (l * vertical);

                //printf("Current Position: %d, %d \n", currentLetterPosition.X, currentLetterPosition.Y);

                if(currentLetterPosition.X >= boardX || currentLetterPosition.X <0) break;
                if(currentLetterPosition.Y >= boardY || currentLetterPosition.Y <0) break;

                if(board[currentLetterPosition.X][currentLetterPosition.Y][0] != 12){
                    if(board[currentLetterPosition.X][currentLetterPosition.Y][0] != words[w][l]) break;
                }

                if(l == 5) success=1;
            }


            if(success){
                for(int l=0; l<6; l++){
                    if(words[w][l] == '\0') break;
                    currentLetterPosition.X = wordStart.X + (l * horizontal);
                    currentLetterPosition.Y = wordStart.Y + (l * vertical);

                    board[currentLetterPosition.X][currentLetterPosition.Y][0] = words[w][l];
                    board[currentLetterPosition.X][currentLetterPosition.Y][1] = 25;
                }
                //printBoard(board);
                //printf("\n");

                break;
            }
        }
    }
}

void fillBoard(int board[boardX][boardY][2]){
    for(int x=0; x<boardX; x++){
        for(int y=0; y<boardY; y++){
            if (board[x][y][0] == 12){
                board[x][y][0]= random(65, 90);
                board[x][y][1] = 10;
            }
        }
    }
}

void pickWords(struct word list[wordNumber]){
    printf("Escolhendo palavras");
}

void printWordList(){
    textcolor(10);
    for(int w = 0; w<5; w++){
        cursor.X = boardPosition.X, cursor.Y = boardPosition.Y + boardY + w + 1;
        gotoxy(cursor);
        for(int l = 0; l <6; l++){
            if(words[w][l] == '\0') break;
            printf("%c ", words[w][l]);
        }
    }
}

int main()
{
    srand(time(NULL));
    adjustFont();

    int board[boardX][boardY][2];

    struct word wordList[wordNumber];

    pickWords(wordList);

    getch();

    while(1){

        initializeBoard(board);

        spawnWords(board);

        fillBoard(board);

        printBoard(board);

        printWordList();
        scanf("%d", &dificuldade);
    }

    //printf("Hello world!\n");
    return 0;
}
