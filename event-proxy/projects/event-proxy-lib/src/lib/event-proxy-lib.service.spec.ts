import { TestBed } from '@angular/core/testing';

import { EventProxyLibService } from './event-proxy-lib.service';
import { HttpClientModule } from '@angular/common/http';

describe('EventProxyLibService', () =>
{
  beforeEach(() => TestBed.configureTestingModule({
    imports:[ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);
    expect(service).toBeTruthy();
  });

  it("should dispatch Event", () =>
  {
    const service: EventProxyLibService = TestBed.get(EventProxyLibService);

    var obs = service.dispatchEvent();

    obs.subscribe( (data) =>{
      console.log(data);
    })


  })

});
