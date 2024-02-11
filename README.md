Hi there! For details on how to get set up and any other dev questions, please reference the [GitHub wiki](https://github.com/rscarbel/job-application-tracking/wiki)!

### Testing

For writing tests with prisma mocks, the easiest way to see what is being called on the mocked prisma object is to log it using the inspect function from node's util library.

It will pretty-print the full object, where as a simple console.log will cut off most of the details.

Example:

```javascript
import { inspect } from "util";

console.log(
  inspect(mockPrisma.job.create.mock.calls, {
    showHidden: false,
    depth: null,
    colors: true,
  })
);
```

<img width="1359" alt="Screenshot 2023-11-07 at 11 10 14 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/425285c2-1fdf-4750-801b-9053b8c3b9be">

<img width="1143" alt="Screenshot 2023-11-07 at 11 11 20 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/bd9f691b-20b9-4717-8918-fbc583716288">

<img width="732" alt="Screenshot 2023-11-07 at 11 11 32 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/51c5a523-917a-4a2e-8258-17d9fa319653">

<img width="733" alt="Screenshot 2023-11-07 at 11 12 10 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/e6e8f08f-b618-4f67-a9e2-90bc7e51acbf">

<img width="545" alt="Screenshot 2023-11-07 at 11 12 20 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/c1faa543-dddf-486e-8ad9-350bd208bf7f">

<img width="1257" alt="Screenshot 2023-11-07 at 11 12 39 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/56a97c5f-9515-49f5-9d7a-2a70f8dbcea7">

<img width="905" alt="Screenshot 2023-11-07 at 11 12 58 PM" src="https://github.com/rscarbel/job-application-tracking/assets/40727301/d6a190ad-8c64-4be3-b677-d7b9e732cf41">

![Job-Application-Tracking](https://github.com/rscarbel/job-application-tracking/assets/40727301/cf293de8-4f1c-4c8d-aaef-8cb2d148f1fc)
