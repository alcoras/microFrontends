/**
 * Event interface
 */
export abstract class CoreEvent {
  /**
   * Event id, should not be 0
   */
  public EventId = 1;

  /**
   * Source event unique id is populated by
   * microservice which parses the event
   */
  public SourceEventUniqueId = 0;

  /**
   * Source id of sender (microservice/frontend)
   * undefined - to prevent sending empty SourceId
   */
  public SourceId = 'undefined';

  /**
   * Aggregate id of event given by EventBroker
   */
  public AggregateId = 0;

  /**
   * Source name sender
   */
  public SourceName = '';

  /**
   * Event type
   */
  public EventLevel = 0;

  /**
   * User id
   */
  public UserId = 0;

  /**
   * Parent id used to indicate which event launched this event
   */
  public ParentId = 0;

  /**
   * Protocol version event
   */
  public ProtocolVersion = '';

  /**
   * Comment for additional information
   */
  public Comment = '';
}
