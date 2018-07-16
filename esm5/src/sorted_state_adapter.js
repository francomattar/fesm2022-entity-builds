var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { createStateOperator, DidMutate } from './state_adapter';
import { createUnsortedStateAdapter } from './unsorted_state_adapter';
import { selectIdValue } from './utils';
export function createSortedStateAdapter(selectId, sort) {
    var _a = createUnsortedStateAdapter(selectId), removeOne = _a.removeOne, removeMany = _a.removeMany, removeAll = _a.removeAll;
    function addOneMutably(entity, state) {
        return addManyMutably([entity], state);
    }
    function addManyMutably(newModels, state) {
        var models = newModels.filter(function (model) { return !(selectIdValue(model, selectId) in state.entities); });
        if (models.length === 0) {
            return DidMutate.None;
        }
        else {
            merge(models, state);
            return DidMutate.Both;
        }
    }
    function addAllMutably(models, state) {
        state.entities = {};
        state.ids = [];
        addManyMutably(models, state);
        return DidMutate.Both;
    }
    function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
    }
    function takeUpdatedModel(models, update, state) {
        if (!(update.id in state.entities)) {
            return false;
        }
        var original = state.entities[update.id];
        var updated = Object.assign({}, original, update.changes);
        var newKey = selectIdValue(updated, selectId);
        delete state.entities[update.id];
        models.push(updated);
        return newKey !== update.id;
    }
    function updateManyMutably(updates, state) {
        var models = [];
        var didMutateIds = updates.filter(function (update) { return takeUpdatedModel(models, update, state); }).length >
            0;
        if (models.length === 0) {
            return DidMutate.None;
        }
        else {
            var originalIds_1 = state.ids;
            var updatedIndexes_1 = [];
            state.ids = state.ids.filter(function (id, index) {
                if (id in state.entities) {
                    return true;
                }
                else {
                    updatedIndexes_1.push(index);
                    return false;
                }
            });
            merge(models, state);
            if (!didMutateIds &&
                updatedIndexes_1.every(function (i) { return state.ids[i] === originalIds_1[i]; })) {
                return DidMutate.EntitiesOnly;
            }
            else {
                return DidMutate.Both;
            }
        }
    }
    function upsertOneMutably(entity, state) {
        return upsertManyMutably([entity], state);
    }
    function upsertManyMutably(entities, state) {
        var added = [];
        var updated = [];
        try {
            for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                var entity = entities_1_1.value;
                var id = selectIdValue(entity, selectId);
                if (id in state.entities) {
                    updated.push({ id: id, changes: entity });
                }
                else {
                    added.push(entity);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var didMutateByUpdated = updateManyMutably(updated, state);
        var didMutateByAdded = addManyMutably(added, state);
        switch (true) {
            case didMutateByAdded === DidMutate.None &&
                didMutateByUpdated === DidMutate.None:
                return DidMutate.None;
            case didMutateByAdded === DidMutate.Both ||
                didMutateByUpdated === DidMutate.Both:
                return DidMutate.Both;
            default:
                return DidMutate.EntitiesOnly;
        }
        var e_1, _a;
    }
    function merge(models, state) {
        models.sort(sort);
        var ids = [];
        var i = 0;
        var j = 0;
        while (i < models.length && j < state.ids.length) {
            var model = models[i];
            var modelId = selectIdValue(model, selectId);
            var entityId = state.ids[j];
            var entity = state.entities[entityId];
            if (sort(model, entity) <= 0) {
                ids.push(modelId);
                i++;
            }
            else {
                ids.push(entityId);
                j++;
            }
        }
        if (i < models.length) {
            state.ids = ids.concat(models.slice(i).map(selectId));
        }
        else {
            state.ids = ids.concat(state.ids.slice(j));
        }
        models.forEach(function (model, i) {
            state.entities[selectId(model)] = model;
        });
    }
    return {
        removeOne: removeOne,
        removeMany: removeMany,
        removeAll: removeAll,
        addOne: createStateOperator(addOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        addAll: createStateOperator(addAllMutably),
        addMany: createStateOperator(addManyMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertMany: createStateOperator(upsertManyMutably),
    };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGVkX3N0YXRlX2FkYXB0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2VudGl0eS9zcmMvc29ydGVkX3N0YXRlX2FkYXB0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBTXhDLE1BQU0sbUNBQXNDLFFBQWEsRUFBRSxJQUFTO0lBR2xFLCtDQUFRLHdCQUFTLEVBQUUsMEJBQVUsRUFBRSx3QkFBUyxDQUV0QztJQUdGLHVCQUF1QixNQUFXLEVBQUUsS0FBVTtRQUM1QyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDeEM7SUFHRCx3QkFBd0IsU0FBZ0IsRUFBRSxLQUFVO1FBQ2xELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQzdCLFVBQUEsS0FBSyxJQUFJLE9BQUEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFuRCxDQUFtRCxDQUM3RCxDQUFDO1FBRUYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQ3ZCO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1NBQ3ZCO0tBQ0Y7SUFHRCx1QkFBdUIsTUFBYSxFQUFF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QUMsQ0FBQztTQUN2RDtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDekMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxNQUFNLENBQUM7UUFDTCxTQUFTLFdBQUE7UUFDVCxVQUFVLFlBQUE7UUFDVixTQUFTLFdBQUE7UUFDVCxNQUFNLEVBQUUsbUJBQW1CLENBQUMsYUFBYSxDQUFDO1FBQzFDLFNBQVMsRUFBRSxtQkFBbUIsQ0FBQyxnQkFBZ0IsQ0FBQztRQUNoRCxTQUFTLEVBQUUsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUM7UUFDaEQsTUFBTSxFQUFFLG1CQUFtQixDQUFDLGFBQWEsQ0FBQztRQUMxQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsY0FBYyxDQUFDO1FBQzVDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUNsRCxVQUFVLEVBQUUsbUJBQW1CLENBQUMsaUJBQWlCLENBQUM7S0FDbkQsQ0FBQztDQUNIIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRW50aXR5U3RhdGUsXG4gIElkU2VsZWN0b3IsXG4gIENvbXBhcmVyLFxuICBEaWN0aW9uYXJ5LFxuICBFbnRpdHlTdGF0ZUFkYXB0ZXIsXG4gIFVwZGF0ZSxcbn0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgY3JlYXRlU3RhdGVPcGVyYXRvciwgRGlkTXV0YXRlIH0gZnJvbSAnLi9zdGF0ZV9hZGFwdGVyJztcbmltcG9ydCB7IGNyZWF0ZVVuc29ydGVkU3RhdGVBZGFwdGVyIH0gZnJvbSAnLi91bnNvcnRlZF9zdGF0ZV9hZGFwdGVyJztcbmltcG9ydCB7IHNlbGVjdElkVmFsdWUgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVNvcnRlZFN0YXRlQWRhcHRlcjxUPihcbiAgc2VsZWN0SWQ6IElkU2VsZWN0b3I8VD4sXG4gIHNvcnQ6IENvbXBhcmVyPFQ+XG4pOiBFbnRpdHlTdGF0ZUFkYXB0ZXI8VD47XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU29ydGVkU3RhdGVBZGFwdGVyPFQ+KHNlbGVjdElkOiBhbnksIHNvcnQ6IGFueSk6IGFueSB7XG4gIHR5cGUgUiA9IEVudGl0eVN0YXRlPFQ+O1xuXG4gIGNvbnN0IHsgcmVtb3ZlT25lLCByZW1vdmVNYW55LCByZW1vdmVBbGwgfSA9IGNyZWF0ZVVuc29ydGVkU3RhdGVBZGFwdGVyKFxuICAgIHNlbGVjdElkXG4gICk7XG5cbiAgZnVuY3Rpb24gYWRkT25lTXV0YWJseShlbnRpdHk6IFQsIHN0YXRlOiBSKTogRGlkTXV0YXRlO1xuICBmdW5jdGlvbiBhZGRPbmVNdXRhYmx5KGVudGl0eTogYW55LCBzdGF0ZTogYW55KTogRGlkTXV0YXRlIHtcbiAgICByZXR1cm4gYWRkTWFueU11dGFibHkoW2VudGl0eV0sIHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZE1hbnlNdXRhYmx5KG5ld01vZGVsczogVFtdLCBzdGF0ZTogUik6IERpZE11dGF0ZTtcbiAgZnVuY3Rpb24gYWRkTWFueU11dGFibHkobmV3TW9kZWxzOiBhbnlbXSwgc3RhdGU6IGFueSk6IERpZE11dGF0ZSB7XG4gICAgY29uc3QgbW9kZWxzID0gbmV3TW9kZWxzLmZpbHRlcihcbiAgICAgIG1vZGVsID0+ICEoc2VsZWN0SWRWYWx1ZShtb2RlbCwgc2VsZWN0SWQpIGluIHN0YXRlLmVudGl0aWVzKVxuICAgICk7XG5cbiAgICBpZiAobW9kZWxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIERpZE11dGF0ZS5Ob25lO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXJnZShtb2RlbHMsIHN0YXRlKTtcbiAgICAgIHJldHVybiBEaWRNdXRhdGUuQm90aDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBhZGRBbGxNdXRhYmx5KG1vZGVsczogVFtdLCBzdGF0ZTogUik6IERpZE11dGF0ZTtcbiAgZnVuY3Rpb24gYWRkQWxsTXV0YWJseShtb2RlbHM6IGFueVtdLCBzdGF0ZTogYW55KTogRGlkTXV0YXRlIHtcbiAgICBzdGF0ZS5lbnRpdGllcyA9IHt9O1xuICAgIHN0YXRlLmlkcyA9IFtdO1xuXG4gICAgYWRkTWFueU11dGFibHkobW9kZWxzLCBzdGF0ZSk7XG5cbiAgICByZXR1cm4gRGlkTXV0YXRlLkJvdGg7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVPbmVNdXRhYmx5KHVwZGF0ZTogVXBkYXRlPFQ+LCBzdGF0ZTogUik6IERpZE11dGF0ZTtcbiAgZnVuY3Rpb24gdXBkYXRlT25lTXV0YWJseSh1cGRhdGU6IGFueSwgc3RhdGU6IGFueSk6IERpZE11dGF0ZSB7XG4gICAgcmV0dXJuIHVwZGF0ZU1hbnlNdXRhYmx5KFt1cGRhdGVdLCBzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiB0YWtlVXBkYXRlZE1vZGVsKG1vZGVsczogVFtdLCB1cGRhdGU6IFVwZGF0ZTxUPiwgc3RhdGU6IFIpOiBib29sZWFuO1xuICBmdW5jdGlvbiB0YWtlVXBkYXRlZE1vZGVsKG1vZGVsczogYW55W10sIHVwZGF0ZTogYW55LCBzdGF0ZTogYW55KTogYm9vbGVhbiB7XG4gICAgaWYgKCEodXBkYXRlLmlkIGluIHN0YXRlLmVudGl0aWVzKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsID0gc3RhdGUuZW50aXRpZXNbdXBkYXRlLmlkXTtcbiAgICBjb25zdCB1cGRhdGVkID0gT2JqZWN0LmFzc2lnbih7fSwgb3JpZ2luYWwsIHVwZGF0ZS5jaGFuZ2VzKTtcbiAgICBjb25zdCBuZXdLZXkgPSBzZWxlY3RJZFZhbHVlKHVwZGF0ZWQsIHNlbGVjdElkKTtcblxuICAgIGRlbGV0ZSBzdGF0ZS5lbnRpdGllc1t1cGRhdGUuaWRdO1xuXG4gICAgbW9kZWxzLnB1c2godXBkYXRlZCk7XG5cbiAgICByZXR1cm4gbmV3S2V5ICE9PSB1cGRhdGUuaWQ7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVNYW55TXV0YWJseSh1cGRhdGVzOiBVcGRhdGU8VD5bXSwgc3RhdGU6IFIpOiBEaWRNdXRhdGU7XG4gIGZ1bmN0aW9uIHVwZGF0ZU1hbnlNdXRhYmx5KHVwZGF0ZXM6IGFueVtdLCBzdGF0ZTogYW55KTogRGlkTXV0YXRlIHtcbiAgICBjb25zdCBtb2RlbHM6IFRbXSA9IFtdO1xuXG4gICAgY29uc3QgZGlkTXV0YXRlSWRzID1cbiAgICAgIHVwZGF0ZXMuZmlsdGVyKHVwZGF0ZSA9PiB0YWtlVXBkYXRlZE1vZGVsKG1vZGVscywgdXBkYXRlLCBzdGF0ZSkpLmxlbmd0aCA+XG4gICAgICAwO1xuXG4gICAgaWYgKG1vZGVscy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBEaWRNdXRhdGUuTm9uZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb3JpZ2luYWxJZHMgPSBzdGF0ZS5pZHM7XG4gICAgICBjb25zdCB1cGRhdGVkSW5kZXhlczogYW55W10gPSBbXTtcbiAgICAgIHN0YXRlLmlkcyA9IHN0YXRlLmlkcy5maWx0ZXIoKGlkOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgaWYgKGlkIGluIHN0YXRlLmVudGl0aWVzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdXBkYXRlZEluZGV4ZXMucHVzaChpbmRleCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbWVyZ2UobW9kZWxzLCBzdGF0ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgIWRpZE11dGF0ZUlkcyAmJlxuICAgICAgICB1cGRhdGVkSW5kZXhlcy5ldmVyeSgoaTogbnVtYmVyKSA9PiBzdGF0ZS5pZHNbaV0gPT09IG9yaWdpbmFsSWRzW2ldKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBEaWRNdXRhdGUuRW50aXRpZXNPbmx5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIERpZE11dGF0ZS5Cb3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHVwc2VydE9uZU11dGFibHkoZW50aXR5OiBULCBzdGF0ZTogUik6IERpZE11dGF0ZTtcbiAgZnVuY3Rpb24gdXBzZXJ0T25lTXV0YWJseShlbnRpdHk6IGFueSwgc3RhdGU6IGFueSk6IERpZE11dGF0ZSB7XG4gICAgcmV0dXJuIHVwc2VydE1hbnlNdXRhYmx5KFtlbnRpdHldLCBzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cHNlcnRNYW55TXV0YWJseShlbnRpdGllczogVFtdLCBzdGF0ZTogUik6IERpZE11dGF0ZTtcbiAgZnVuY3Rpb24gdXBzZXJ0TWFueU11dGFibHkoZW50aXRpZXM6IGFueVtdLCBzdGF0ZTogYW55KTogRGlkTXV0YXRlIHtcbiAgICBjb25zdCBhZGRlZDogYW55W10gPSBbXTtcbiAgICBjb25zdCB1cGRhdGVkOiBhbnlbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBlbnRpdHkgb2YgZW50aXRpZXMpIHtcbiAgICAgIGNvbnN0IGlkID0gc2VsZWN0SWRWYWx1ZShlbnRpdHksIHNlbGVjdElkKTtcbiAgICAgIGlmIChpZCBpbiBzdGF0ZS5lbnRpdGllcykge1xuICAgICAgICB1cGRhdGVkLnB1c2goeyBpZCwgY2hhbmdlczogZW50aXR5IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkZWQucHVzaChlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGRpZE11dGF0ZUJ5VXBkYXRlZCA9IHVwZGF0ZU1hbnlNdXRhYmx5KHVwZGF0ZWQsIHN0YXRlKTtcbiAgICBjb25zdCBkaWRNdXRhdGVCeUFkZGVkID0gYWRkTWFueU11dGFibHkoYWRkZWQsIHN0YXRlKTtcblxuICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgY2FzZSBkaWRNdXRhdGVCeUFkZGVkID09PSBEaWRNdXRhdGUuTm9uZSAmJlxuICAgICAgICBkaWRNdXRhdGVCeVVwZGF0ZWQgPT09IERpZE11dGF0ZS5Ob25lOlxuICAgICAgICByZXR1cm4gRGlkTXV0YXRlLk5vbmU7XG4gICAgICBjYXNlIGRpZE11dGF0ZUJ5QWRkZWQgPT09IERpZE11dGF0ZS5Cb3RoIHx8XG4gICAgICAgIGRpZE11dGF0ZUJ5VXBkYXRlZCA9PT0gRGlkTXV0YXRlLkJvdGg6XG4gICAgICAgIHJldHVybiBEaWRNdXRhdGUuQm90aDtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBEaWRNdXRhdGUuRW50aXRpZXNPbmx5O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1lcmdlKG1vZGVsczogVFtdLCBzdGF0ZTogUik6IHZvaWQ7XG4gIGZ1bmN0aW9uIG1lcmdlKG1vZGVsczogYW55W10sIHN0YXRlOiBhbnkpOiB2b2lkIHtcbiAgICBtb2RlbHMuc29ydChzb3J0KTtcblxuICAgIGNvbnN0IGlkczogYW55W10gPSBbXTtcblxuICAgIGxldCBpID0gMDtcbiAgICBsZXQgaiA9IDA7XG5cbiAgICB3aGlsZSAoaSA8IG1vZGVscy5sZW5ndGggJiYgaiA8IHN0YXRlLmlkcy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gbW9kZWxzW2ldO1xuICAgICAgY29uc3QgbW9kZWxJZCA9IHNlbGVjdElkVmFsdWUobW9kZWwsIHNlbGVjdElkKTtcbiAgICAgIGNvbnN0IGVudGl0eUlkID0gc3RhdGUuaWRzW2pdO1xuICAgICAgY29uc3QgZW50aXR5ID0gc3RhdGUuZW50aXRpZXNbZW50aXR5SWRdO1xuXG4gICAgICBpZiAoc29ydChtb2RlbCwgZW50aXR5KSA8PSAwKSB7XG4gICAgICAgIGlkcy5wdXNoKG1vZGVsSWQpO1xuICAgICAgICBpKys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZHMucHVzaChlbnRpdHlJZCk7XG4gICAgICAgIGorKztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA8IG1vZGVscy5sZW5ndGgpIHtcbiAgICAgIHN0YXRlLmlkcyA9IGlkcy5jb25jYXQobW9kZWxzLnNsaWNlKGkpLm1hcChzZWxlY3RJZCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5pZHMgPSBpZHMuY29uY2F0KHN0YXRlLmlkcy5zbGljZShqKSk7XG4gICAgfVxuXG4gICAgbW9kZWxzLmZvckVhY2goKG1vZGVsLCBpKSA9PiB7XG4gICAgICBzdGF0ZS5lbnRpdGllc1tzZWxlY3RJZChtb2RlbCldID0gbW9kZWw7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJlbW92ZU9uZSxcbiAgICByZW1vdmVNYW55LFxuICAgIHJlbW92ZUFsbCxcbiAgICBhZGRPbmU6IGNyZWF0ZVN0YXRlT3BlcmF0b3IoYWRkT25lTXV0YWJseSksXG4gICAgdXBkYXRlT25lOiBjcmVhdGVTdGF0ZU9wZXJhdG9yKHVwZGF0ZU9uZU11dGFibHkpLFxuICAgIHVwc2VydE9uZTogY3JlYXRlU3RhdGVPcGVyYXRvcih1cHNlcnRPbmVNdXRhYmx5KSxcbiAgICBhZGRBbGw6IGNyZWF0ZVN0YXRlT3BlcmF0b3IoYWRkQWxsTXV0YWJseSksXG4gICAgYWRkTWFueTogY3JlYXRlU3RhdGVPcGVyYXRvcihhZGRNYW55TXV0YWJseSksXG4gICAgdXBkYXRlTWFueTogY3JlYXRlU3RhdGVPcGVyYXRvcih1cGRhdGVNYW55TXV0YWJseSksXG4gICAgdXBzZXJ0TWFueTogY3JlYXRlU3RhdGVPcGVyYXRvcih1cHNlcnRNYW55TXV0YWJseSksXG4gIH07XG59XG4iXX0=