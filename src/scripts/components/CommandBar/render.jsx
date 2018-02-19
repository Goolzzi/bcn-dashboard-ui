import React from 'react';

var classNames = require('classnames');

const Command = props => {
    var boundClick = props.onCommandClick.bind(null, props.command);
    var boundMouseOver = props.onMouseOver.bind(null, props.command);
    var boundMouseOut = props.onMouseOut.bind(null, props.command);
    return (
        <div className={ 'command' + (props.highlightedCommand === props.command.id ? ' highlighted' : '') }
        onClick={ boundClick } onMouseOver={ boundMouseOver } onMouseOut={ boundMouseOut } >
            <span className='action'>{ props.command.command }</span>
            <span className='params'>{ props.command.parameters }</span>
            <span className='description'>{ props.command.description }</span>
        </div>
    )
};

const CommandGroup = props => (
    <div className='command-group'>
        { props.name === 'do-not-display' ? null : <h4>{ props.name } commands</h4> }
        { props.commands.map(function(command) {
            return <Command command={ command }
                key={ command.id }
                highlightedCommand={ props.highlightedCommand }
                onCommandClick={ props.onCommandClick }
                onMouseOver={ props.onMouseOver }
                onMouseOut={ props.onMouseOut } />
        }, this) }
    </div>
);

const CommandError = props => (
    <div className='command-group'>
        <div className='command error-msg' data-bcn-id='commandBar-errorMsg'>{ props.message }</div>
    </div>
);

const CommandInfo = props => (
    <div className='command-group'>
        <div className='command info-msg'>{ props.message }</div>
    </div>
);

const CommandGroups = (commandGroupsFiltered, highlightedCommand, onCommandClick, onMouseOver, onMouseOut) => (
    commandGroupsFiltered.map(function(group, key) {
        return (
            <CommandGroup key={ key }
                name={ group.group_name }
                commands={ group.commands }
                highlightedCommand={ highlightedCommand }
                onCommandClick={ onCommandClick }
                onMouseOver={ onMouseOver }
                onMouseOut={ onMouseOut } />
        )
    })
);

export default {
    CommandBar: function () {
        var inputBarClass = classNames({
            'bar':true,
            'active':this.state.isActive});
        return (
            <div className='CommandBar container-fluid'>
                <input type='text'
                    className={inputBarClass}
                    placeholder={ this.state.presenter.defaultMessage }
                    value={ this.state.enteredCommand }
                    ref='commandBarInput'
                    onChange={ this._handleChange }
                    onFocus={ this._handleFocus }
                    onKeyDown={ this._handleKeyDown } />
                { this.state.showAvailableCommands ?
                    <div className='available-commands'>
                        {
                        this.state.commandError ?
                           <CommandError message={ this.state.commandError } />
                        : this.state.commandInfo ?
                           <CommandInfo message={ this.state.commandInfo } />
                        :
                           CommandGroups( this.state.commandGroupsFiltered, this.state.highlightedCommand, this._handleCommandClick, this._handleMouseOver, this._handleMouseOut)
                        }
                    </div>
                : null }
             </div>
        );
    }
};
