export interface GetAllCategoryRequest {
    page: number;
    size: number;
    search?: string;
    isActive?: boolean;
}
export interface GetAllCategoryBaseResponse {
    status: number;
    message: string;
    data: GetAllCategoryResponsePagination;
}
export interface GetAllCategoryResponsePagination {
    size: number;
    page: number;
    total: number;
    totalPages: number;
    items: Category[];
}
export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    quantityProduct: number;
    createdDate: string;
    lastModifiedDate: string | null;
    isActive: boolean;
}
// https://api.newmwayteakwood.vn/api/v1/categories?Page=1&Size=10

// {
//   "status": 200,
//   "message": "Categories success",
//   "data": {
//     "size": 10,
//     "page": 1,
//     "total": 5,
//     "totalPages": 1,
//     "items": [
//       {
//         "id": "45d74b95-da37-4e04-7fe7-08de268b12ef",
//         "name": "Kayo",
//         "description": "Kayo",
//         "icon": "Kayo",
//         "quantityProduct": 1,
//         "createdDate": "2025-11-18T17:13:09.4589868",
//         "lastModifiedDate": "2025-11-24T09:17:36.5709341",
//         "isActive": true
//       },
//       {
//         "id": "3e561b09-836f-436d-e5d1-08de26c549b9",
//         "name": "string1",
//         "description": "string",
//         "icon": "string",
//         "quantityProduct": 0,
//         "createdDate": "2025-11-19T00:09:52.0915072",
//         "lastModifiedDate": "2025-11-24T09:17:39.1662202",
//         "isActive": false
//       },
//       {
//         "id": "5298a811-d88c-492d-391c-08de273b3e69",
//         "name": "string2",
//         "description": "string",
//         "icon": "string",
//         "quantityProduct": 0,
//         "createdDate": "2025-11-19T15:29:39.8092828",
//         "lastModifiedDate": null,
//         "isActive": false
//       },
//       {
//         "id": "66d0570f-36c8-4cf4-10d0-08de28109d17",
//         "name": "Thớt gỗ",
//         "description": "Thớt gỗ NewMWay",
//         "icon": "",
//         "quantityProduct": 1,
//         "createdDate": "2025-11-20T15:41:35.3762027",
//         "lastModifiedDate": null,
//         "isActive": true
//       },
//       {
//         "id": "a39f77f2-8c9e-4fcf-74e5-08de2c0d34ac",
//         "name": "Phụ kiện",
//         "description": "",
//         "icon": "",
//         "quantityProduct": 2,
//         "createdDate": "2025-11-25T17:27:16.4139849",
//         "lastModifiedDate": null,
//         "isActive": true
//       }
//     ]
//   }
// }