import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { tsvParse, csvParse } from 'd3';
import { Observable } from 'rxjs';
import { concatAll, map, toArray } from 'rxjs/operators';
import { IDatasetMapperFn, IDatasetParserFn, IExampleDense, IExampleMultiple, IExampleSimple } from './dataset.types';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private http: HttpClient) { }

  getExamplesSimple(): Observable<readonly IExampleSimple[]> {
    return this.loadFile<IExampleSimple>('examples-simple.tsv', tsvParse as IDatasetParserFn,
      ({x, y}) => ({
        x: Number(x),
        y: Number(y)
      })
    );
  }

  getExamplesMultiple(): Observable<readonly IExampleMultiple[]> {
    return this.loadFile<IExampleMultiple>('examples-multiple.tsv', tsvParse as IDatasetParserFn,
      ({x, y1, y2}) => ({
        x: Number(x),
        y1: Number(y1),
        y2: Number(y2)
      })
    );
  }

  getDenseDataset(): Observable<readonly IExampleDense[]> {
    return this.loadFile<IExampleDense>('dense.csv', csvParse as IDatasetParserFn,
      ({A, B, C}) => ({
        A: Number(A),
        B: Number(B),
        C: Number(C)
      })
    );
  }

  private getTextFromFile(fileName: string): Observable<string> {
    const PATH = '/assets/dataset';
    return this.http.get(`${PATH}/${fileName}`, {responseType: 'text'});
  }

  private loadFile<T>(fileName: string, parserFn: IDatasetParserFn, mapperFn: IDatasetMapperFn<T>): Observable<T[]> {
    return this.getTextFromFile(fileName)
      .pipe(
        map(parserFn),
        concatAll(),
        map(mapperFn),
        toArray()
      );
  }
 
}
