import * as React from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableLocation,
    DraggableProvided,
    DraggableStateSnapshot, DraggingStyle,
    Droppable,
    DroppableProvided,
    DroppableStateSnapshot,
    DropResult, NotDraggingStyle
} from 'react-beautiful-dnd';
import './ExampleMap.css';
import {Flex} from "rebass";

interface Item {
    id: string;
    content: string;
}

interface IExampleMapState {
    items: Item[];
    selected: Item[];
}

interface IMoveResult {
    droppable: Item[];
    droppable2: Item[];
}

const getItems = (count: number, offset: number = 0): Item[] => {
    return Array
        .from({length: count}, (v, k) => k)
        .map(k => ({
            content: `item ${k + offset}`,
            id: `item-${k + offset}`
        }));
};

const reorder = (list: Item[], startIndex: number, endIndex: number): Item[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


/**
 * Moves an item from one list to another list.
 */
const move = (source: Item[], destination: Item[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation): IMoveResult | any => {
    const sourceClone = [...source];
    const destClone = [...destination];
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid: number = 8;

const getItemStyle = (draggableStyle: DraggingStyle | NotDraggingStyle | undefined, isDragging: boolean): {} => ({
    userSelect: 'none',
    padding: 2 * grid,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean): {} => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 300,
    minHeight: 400
});

export default class ExampleMap extends React.Component<{}, IExampleMapState> {

    public id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    constructor(props: any) {
        super(props);

        this.state = {
            items: getItems(10, 0),
            selected: getItems(5, 10)
        };

        this.onDragEnd = this.onDragEnd.bind(this);
        this.getList = this.getList.bind(this);
    }

    public getList(id: string): Item[] {
        return this.state[this.id2List[id]];
    }

    public onDragEnd(result: DropResult): void {

        const {source, destination} = result;

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state: IExampleMapState = {...this.state};

            if (source.droppableId === "droppable2") {
                state = {...this.state, selected: items};
            } else if (source.droppableId === "droppable") {
                state = {...this.state, items}
            }

            this.setState(state);

        } else {
            const resultFromMove: IMoveResult = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: resultFromMove.droppable,
                selected: resultFromMove.droppable2
            });
        }
    }

    public render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Flex>
                    <Droppable droppableId="droppable">
                        {(droppableProvided: DroppableProvided, droppableStateSnapshot: DroppableStateSnapshot) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                style={getListStyle(droppableStateSnapshot.isDraggingOver)}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(draggableProvided: DraggableProvided, draggableStateSnapshot: DraggableStateSnapshot) => (
                                            <div>
                                                <div
                                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}
                                                    style={getItemStyle(
                                                        draggableProvided.draggableProps.style,
                                                        draggableStateSnapshot.isDragging
                                                    )}
                                                >
                                                    {item.content}
                                                </div>
                                                {draggableProvided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Droppable droppableId="droppable2">
                        {(droppableProvided: DroppableProvided, droppableStateSnapshot: DroppableStateSnapshot) => (
                            <div
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                                style={getListStyle(droppableStateSnapshot.isDraggingOver)}>
                                {this.state.selected.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(draggableProvided: DraggableProvided, draggableStateSnapshot: DraggableStateSnapshot) => (
                                            <div>
                                                <div
                                                    ref={draggableProvided.innerRef}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}
                                                    style={getItemStyle(
                                                        draggableProvided.draggableProps.style,
                                                        draggableStateSnapshot.isDragging
                                                    )}>
                                                    {item.content}
                                                </div>
                                                {draggableProvided.placeholder}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Flex>
            </DragDropContext>
        );
    }

}
