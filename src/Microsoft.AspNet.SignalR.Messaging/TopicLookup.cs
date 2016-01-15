// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.


using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using Microsoft.AspNet.SignalR.Infrastructure;

namespace Microsoft.AspNet.SignalR.Messaging
{
    public sealed class TopicLookup : IEnumerable<KeyValuePair<string, Topic>>
    {
        private readonly ConcurrentDictionary<string, Topic> _topics = new ConcurrentDictionary<string, Topic>(new SipHashBasedStringEqualityComparer());
        
        public int Count
        {
            get
            {
                return _topics.Count;
            }
        }

        public Topic this[string key]
        {
            get
            {
                Topic topic;
                if (TryGetValue(key, out topic))
                {
                    return topic;
                }
                return null;
            }
        }

        public bool ContainsKey(string key)
        {
            return _topics.ContainsKey(key);
        }

        public bool TryGetValue(string key, out Topic topic)
        {
            return _topics.TryGetValue(key, out topic);
        }

        public IEnumerator<KeyValuePair<string, Topic>> GetEnumerator()
        {
            return _topics.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public bool TryRemove(string key)
        {
            Topic topic;
            return _topics.TryRemove(key, out topic);
        }

        public Topic GetOrAdd(string key, Func<string, Topic> factory)
        {
            return _topics.GetOrAdd(key, factory);
        }

        public void Clear()
        {
            _topics.Clear();
        }
    }
}
