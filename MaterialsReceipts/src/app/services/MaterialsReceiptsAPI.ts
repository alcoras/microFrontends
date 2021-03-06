import { Injectable } from "@angular/core";
import {
	EventProxyLibService,
	LocationsData,
	MaterialsReceiptsLocationsAddRemove,
	MaterialsReceiptsLocationsAddRemoveFlag,
	MaterialsReceiptsLocationsReadListQuery,
	MaterialsReceiptsLocationsReadListResults,
	MaterialsReceiptsMaterialsAtLocationsReadListQuery,
	MaterialsReceiptsMaterialsAtLocationsReadListResults,
	MaterialsReceiptsMaterialsReadListQuery,
	MaterialsReceiptsMaterialsReadListResults,
	MaterialsReceiptsReadListQuery,
	MaterialsReceiptsReadListResults,
	MaterialsReceiptsScanTableAddRemove,
	MaterialsReceiptsScanTableAddRemoveFlag,
	MaterialsReceiptsScanTableReadListQuery,
	MaterialsReceiptsScanTableReadListResults,
	MaterialsReceiptsTablePartReadListQuery,
	MaterialsReceiptsTablePartReadListResults,
	MicroFrontendParts,
	ValidationStatus,
	ScanTableData,
	BackendToFrontendEvent,
	CoreEvent,
	MaterialsData,
	MaterialsReceiptsMaterials,
	MaterialsReceiptsMaterialsAddRemoveFlag,
	OrchestratorTeam1BarCodeDetailsQuery,
	OrchestratorTeam1BarCodeDetailsResult,
	EventIds,
	MaterialsReceiptsMaterialsQueryListIds,
	DraftsCreateAndOthers,
	DraftsEventFlags,
	DraftsCreateAndOthersResults,
	DraftsDelete,
	CommonId,
	OrchestratorTeam1MaterialsScanSignedUnsigned,
	SingUnsignFlag,
	InventoryManagerResults,
	InventoryManagerQuery
} from "event-proxy-lib-src";
import { EventBusService } from "./EventBusService";
import { ReadListQueryParams } from "../Adds/ReadListQueryParams";
import { ScanTableQueryParams } from "../Adds/ScanTableQueryParams";

@Injectable({
	providedIn: "root",
})
export class MaterialsReceiptsAPI {
	private sourceInfo = MicroFrontendParts.MaterialsReceipts;

	private readonly MaterialsInventoryName = "MaterialsInventoryQuantity";

	public constructor(private eventProxyService: EventProxyLibService, private eventBusService: EventBusService) { }

	/**
	 * Quries inventory manager for MaterialsInventoryQuantity
	 */
	public async InventoryManagerQueryAsync(): Promise<ValidationStatus<InventoryManagerResults>> {
		const event = new InventoryManagerQuery(this.sourceInfo, this.MaterialsInventoryName, new Date().toISOString());
		event.SubscribeToChildren = true;

		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<InventoryManagerResults>(request);
	}

	/**
	 * Unsign scan data for specific material list
	 * @param materialSignId Materials scan signed (set the id of Materials list in this event)
	 * @returns Promise with timeout or response from backend with results
	 */
	public async MaterialScanUnsignAsync(materialSignId: number): Promise<ValidationStatus<CoreEvent>> {
		const event = new OrchestratorTeam1MaterialsScanSignedUnsigned(this.sourceInfo, SingUnsignFlag.Unsign, materialSignId);
		event.SubscribeToChildren = true;
		event.SubscribeToChildrenEventIds = [
			EventIds.OrchestratorTeam1OrchestrationFailed,
			EventIds.OrchestratorTeam1OrchestrationSuccess ];

		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<CoreEvent>(request);
	}

	/**
	 * Sign scan data for specific material list
	 * @param materialSignId Materials scan signed (set the id of Materials list in this event)
	 * @returns Promise with timeout or response from backend with results
	 */
	public async MaterialScanSignAsync(materialSignId: number): Promise<ValidationStatus<CoreEvent>> {
		const event = new OrchestratorTeam1MaterialsScanSignedUnsigned(this.sourceInfo, SingUnsignFlag.Sign, materialSignId);
		event.SubscribeToChildren = true;
		event.SubscribeToChildrenEventIds = [
			EventIds.OrchestratorTeam1OrchestrationFailed,
			EventIds.OrchestratorTeam1OrchestrationSuccess ];

		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<CoreEvent>(request);
	}

	/**
	 * Main purpose is to unify all draft creations, should be somewhere globally so all drafts maintain format
	 * @param firstTypeName name for data type which needs a reference to second"s type (example: ScanTableData needs a material draft)
	 * @param firstTypeId id used to find right draft based on context (Example: ScanTableData where id 10) (string because at somepoint id can be GUID or something)
	 * @param secondTypeName name for data type which we creating reference to (Example: for ScanTableData id 10 we need MaterialElement)
	 * @returns string which is basically concat of previous values and microfrontend"s name
	 */
	public CreateDraftKeyString(firstTypeName: string, firstTypeId: string, secondTypeName: string): string {
		return `${this.sourceInfo.SourceName}${firstTypeName}${firstTypeId}${secondTypeName}`;
	}

	/**
	 * Update existing draft
	 * @param id draft"s id which we want to update
	 * @param keyString filter key
	 * @param draft new draft
	 * @returns ValidationStatus with BackendToFrontendEvent
	 */
	public async DraftsUpdateAsync(id: number, keyString: string, draft: string): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new DraftsCreateAndOthers(this.sourceInfo, DraftsEventFlags.Update, keyString, draft, id);

		return await this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Create new draft
	 * @param keyString unique key string to identify draft
	 * @param draft draft"s body in json
	 * @returns ValidationStatus with BackendToFrontendEvent
	 */
	public async DraftsCreateAsync(keyString: string, draft: string): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new DraftsCreateAndOthers(this.sourceInfo, DraftsEventFlags.Create, keyString, draft);

		return await this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Try to get existing draft
	 * @param keyString unique key and value combination which will be used later on to find this draft
	 * @returns ValidationStatus with BackendToFrontendEvent
	 */
	public async DraftsGetAsync(keyString: string): Promise<ValidationStatus<DraftsCreateAndOthersResults>> {
		const event = new DraftsCreateAndOthers(this.sourceInfo, DraftsEventFlags.Get, keyString);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<DraftsCreateAndOthersResults>(request);
	}

	/**
	 * Deletes drafts provided by their ids numbers
	 * @param ids list of draft ids to delete
	 * @returns ValidationStatus with BackendToFrontendEvent
	 */
	public async DraftsDeleteAsync(ids: number[]): Promise<ValidationStatus<BackendToFrontendEvent>> {
		return await this.eventProxyService.DispatchEventAsync(new DraftsDelete(this.sourceInfo, ids));
	}

	/**
	 * Gets existing barcodes from all entries in specified Materials Receipts
	 * @param materialReceiptId MaterialsReceiptsList Id
	 * @returns ValidationStatus with OrchestratorTeam1BarCodeDetailsResult
	 */
	public async BarCodesByMaterialReceiptQueryAsync(materialReceiptId: number): Promise<ValidationStatus<OrchestratorTeam1BarCodeDetailsResult>> {
		const event = new OrchestratorTeam1BarCodeDetailsQuery(this.sourceInfo, materialReceiptId);
		event.SubscribeToChildren = true;
		event.SubscribeToChildrenEventIds = [ EventIds.OrchestratorTeam1BarCodeDetailsResult ];

		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<OrchestratorTeam1BarCodeDetailsResult>(request);
	}

	/**
	 * Query multiple Material elements
	 * @param materialIdList List of MaterialElement ids
	 * @returns ValidationStatus with BackendToFrontendEvent
	 */
	public async MaterialsQueryByListAsync(materialIdList: number[]): Promise<ValidationStatus<MaterialsReceiptsMaterialsReadListResults>> {
		const event = new MaterialsReceiptsMaterialsQueryListIds(this.sourceInfo, materialIdList);
		event.SubscribeToChildren = true;

		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<MaterialsReceiptsMaterialsReadListResults>(request);
	}

	/**
	 * Query materials
	 * @param materialId id
	 * @param barCode material"s barcode
	 * @param page which page to query
	 * @param limit limit of entries per page
	 * @returns ValidationStatus with MaterialsReceiptsMaterialsReadListResults
	 */
	public async MaterialsQueryAsync(materialId?: number, barCode?: string, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsMaterialsReadListResults>> {

		const event = new MaterialsReceiptsMaterialsReadListQuery(this.sourceInfo, materialId, barCode, page, limit);
		event.SubscribeToChildren = true;

		const request = await this.eventProxyService.DispatchEventAsync(event);

		if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

		const uniqueId = request.Result.Ids[0];

		const responsePromise = new Promise<MaterialsReceiptsMaterialsReadListResults>((resolve) => {
			this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsMaterialsReadListResults) => {
				if (data.ParentId == uniqueId) resolve(data);
			});
		});

		return this.eventProxyService.RacePromiseAsync(responsePromise);
	}

	/**
	 * Creates a material
	 * @param materialsData MaterialsElement representation
	 * @returns Promise with ReponseStatus
	 */
	public async MaterialCreateAsync(materialsData: MaterialsData): Promise<ValidationStatus<CommonId>> {
		const event = new MaterialsReceiptsMaterials(this.sourceInfo, materialsData, MaterialsReceiptsMaterialsAddRemoveFlag.Create);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<CommonId>(request);
	}

	/**
	 * Deletes a material by id
	 * @param materialsData MaterialsElement representation
	 * @returns Promise with ReponseStatus
	 */
	public MaterialDeleteAsync(materialsData: MaterialsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new MaterialsReceiptsMaterials(this.sourceInfo, materialsData, MaterialsReceiptsMaterialsAddRemoveFlag.Delete);
		return this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Get material receipt associated list of entries
	 * @param materialsReceiptId material receipt id
	 * @param page page
	 * @param limit limit
	 * @returns ValidationStatus with MaterialsReceiptsTablePartReadListResults
	 */
	public async MaterialsReceiptsTableQueryAsync(materialsReceiptId?: number, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsTablePartReadListResults>> {
		const event = new MaterialsReceiptsTablePartReadListQuery(this.sourceInfo, materialsReceiptId, page, limit);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<MaterialsReceiptsTablePartReadListResults>(request);
	}

	/**
	 * Creates new location
	 * @param data new location data
	 * @returns ReponseStatus
	 */
	public LocationCreateAsync(data: LocationsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new MaterialsReceiptsLocationsAddRemove(this.sourceInfo, data, MaterialsReceiptsLocationsAddRemoveFlag.Create);

		return this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Creates new material scan
	 * @param data MaterialsReceiptsScanTable
	 * @returns ValidationStatus
	 */
	public ScanTableCreateAsync(data: ScanTableData): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new MaterialsReceiptsScanTableAddRemove(this.sourceInfo, data, MaterialsReceiptsScanTableAddRemoveFlag.Create);

		return this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Deletes location
	 * @param locationData location information
	 * @returns ValidationStatus
	 */
	public LocationDeleteAsync(locationData: LocationsData): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new MaterialsReceiptsLocationsAddRemove(this.sourceInfo, locationData, MaterialsReceiptsLocationsAddRemoveFlag.Delete);

		return this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 * Deletes material scan
	 * @param data MaterialsReceiptsScanTable
	 * @returns ValidationStatus
	 */
	public ScanTableDeleteAsync(data: ScanTableData): Promise<ValidationStatus<BackendToFrontendEvent>> {
		const event = new MaterialsReceiptsScanTableAddRemove(this.sourceInfo, data, MaterialsReceiptsScanTableAddRemoveFlag.Delete);

		return this.eventProxyService.DispatchEventAsync(event);
	}

	/**
	 *
	 * @param page which page to query
	 * @param limit limit of entries per page
	 * @param materialsId material"s id
	 * @param locationId location"s id
	 * @returns ValidationStatus
	 */
	public async MaterialsAtLocationQueryAsync(page: number, limit: number, materialsId?: number, locationId?: number): Promise<ValidationStatus<MaterialsReceiptsMaterialsAtLocationsReadListResults>> {

		const event = new MaterialsReceiptsMaterialsAtLocationsReadListQuery(this.sourceInfo, materialsId, locationId, page, limit);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		return this.waitForResults<MaterialsReceiptsMaterialsAtLocationsReadListResults>(request);
	}

	/**
	 * Query locations
	 * @param locationId location id
	 * @param page which page to query
	 * @param limit limit of entries per page
	 * @returns ValidationStatus with MaterialsReceiptsLocationsReadListResults if čiki-piki
	 */
	public async LocationsQueryAsync(locationId: number, page?: number, limit?: number): Promise<ValidationStatus<MaterialsReceiptsLocationsReadListResults>> {
		const event = new MaterialsReceiptsLocationsReadListQuery(this.sourceInfo, locationId, page, limit);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

		const uniqueId = request.Result.Ids[0];

		const responsePromise = new Promise<MaterialsReceiptsLocationsReadListResults>((resolve) => {
			this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsLocationsReadListResults) => {
				if (data.ParentId === uniqueId) resolve(data);
			});
		});

		return this.eventProxyService.RacePromiseAsync(responsePromise);
	}

	/**
	 * Queries scan table
	 * @param queryParams scan table query params
	 * @returns Promise with MaterialsReceiptsScanTableReadListResults
	 */
	public async ScanTableQueryAsync(queryParams: ScanTableQueryParams): Promise<ValidationStatus<MaterialsReceiptsScanTableReadListResults>> {
		const event = new MaterialsReceiptsScanTableReadListQuery(
			this.sourceInfo,
			queryParams.ScanTableId,
			queryParams.MaterialsId,
			queryParams.MaterialReceiptsListId,
			queryParams.MaterialReceiptsTableId,
			queryParams.Page,
			queryParams.Limit);
		event.SubscribeToChildren = true;

		const request = await this.eventProxyService.DispatchEventAsync(event);

		if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

		const uniqueId = request.Result.Ids[0];

		const responsePromise = new Promise<MaterialsReceiptsScanTableReadListResults>((resolve) => {
			this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsScanTableReadListResults) => {
				if (data.ParentId === uniqueId) { resolve(data);}
			});
		});

		return this.eventProxyService.RacePromiseAsync(responsePromise);
	}

	/**
	 * Queries Material Receipt List
	 * @param queryParams Query Class params
	 * @returns Http Response
	 */
	public async MaterialsReceiptsListQueryAsync(queryParams: ReadListQueryParams): Promise<ValidationStatus<MaterialsReceiptsReadListResults>> {
		const event = new MaterialsReceiptsReadListQuery(
			this.sourceInfo,
			queryParams.DateFrom,
			queryParams.DateUntil,
			queryParams.Signed,
			queryParams.Page,
			queryParams.Limit);
		event.SubscribeToChildren = true;
		const request = await this.eventProxyService.DispatchEventAsync(event);

		if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

		const uniqueId = request.Result.Ids[0];

		const responsePromise = new Promise<MaterialsReceiptsReadListResults>((resolve) => {
			this.eventBusService.EventBus.subscribe((data: MaterialsReceiptsReadListResults) => {
				if (data.ParentId === uniqueId) resolve(data);
			});
		});

		return this.eventProxyService.RacePromiseAsync(responsePromise);
	}

	/**
	 * Experimental wrapper for requests, not sure if it's good idea to use it as it adds layer of complexity and it is easier to read simple longer code than complex few-liners
	 * @param request request which returns id from backend (currently only one)
	 * @returns Promise of ValidationStatus with T which is event that extends CoreEvent
	 */
	private async waitForResults<T extends CoreEvent>(request: ValidationStatus<BackendToFrontendEvent>): Promise<ValidationStatus<T>> {
		if (request.HasErrors()) return Promise.reject(request.ErrorList.toString());

		const uniqueId = request.Result.Ids[0];

		const responsePromise = new Promise<T>((resolve) => {
			const sub = this.eventBusService.EventBus.subscribe((data: CoreEvent) => {
				if (data.ParentId == uniqueId) {
					sub.unsubscribe();
					resolve(<T>data);
				}
			});
		});

		return this.eventProxyService.RacePromiseAsync(responsePromise);
	}
}
