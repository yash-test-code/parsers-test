#define MAX_STRUCTURE_NAME_SIZE 128                  // max length of structure name
#define MAX_FIELD_NAME_SIZE 128                      // max length of field name

typedef struct _struct_db_rec_ struct_db_rec_t;

struct _struct_db_rec_ {
    struct_db_rec_t *next;
    char struct_name[MAX_STRUCTURE_NAME_SIZE];       // will also act as key
    unsigned int ds_size;                            // size of the structure
    unsigned int n_fields;                           // no. of fields in stucture
    field_info_t *fields;                            // array of fields in the structure. 
                                                     // each element will hold information about
                                                     // a field of the structure
}

// this structure holds fields info of any structure
typedef struct _field_info{
    char fname[MAX_FIELD_NAME_SIZE];                 // field name
    unsigned int size;                               // size of field
    unsigned int offset;                             // displacement of field from the beginning of structure
    data_type_t dtype;                               // data type of field
    char nested_str_name[MAX_STRUCTURE_NAME_SIZE];   // if a field is a nested structure object then its name is stored here 
}field_info_t;

// this enumeration is used to identify the type of a field in a structure
typedef enum{
    UINT8;       // unsigned integer of 8 bits
    UINT32;      // unsigned integer of 32 bits
    INT32;       // integer of 32 bits   
    CHAR;        // character
    OBJ_PTR;     // pointer to object of some structure type
    FLOAT;       
    DOUBLE;
    OBJ_STRUCT   // any structure 
}data_type_t;